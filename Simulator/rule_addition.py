# rule_addition.py
# Firewall policy management for H-SAFE

import json
import os
import uuid
from typing import List, Optional

from schema import Rule, RuleConditions, validate_rule

import shutil

RULE_STORE_PATH = "/tmp/rules.json"  # Use /tmp for serverless consistency
BUNDLED_RULES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rules.json")

def _initialize_storage():
    """Ensure writable rules file exists in /tmp"""
    if not os.path.exists(RULE_STORE_PATH):
        if os.path.exists(BUNDLED_RULES_PATH):
            try:
                shutil.copy(BUNDLED_RULES_PATH, RULE_STORE_PATH)
            except Exception:
                # Fallback to empty list if copy fails/bundled file issues
                with open(RULE_STORE_PATH, "w") as f:
                    json.dump([], f)
        else:
             with open(RULE_STORE_PATH, "w") as f:
                json.dump([], f)


# =========================
# INTERNAL HELPERS
# =========================

def _load_rules_from_disk() -> List[Rule]:
    _initialize_storage()
    if not os.path.exists(RULE_STORE_PATH):
        return []

    with open(RULE_STORE_PATH, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            if not isinstance(data, list):
                return []
            return data
        except json.JSONDecodeError:
            return []


def _save_rules_to_disk(rules: List[Rule]) -> None:
    with open(RULE_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(rules, f, indent=4)


# =========================
# PUBLIC API
# =========================

def add_rule(
    name: str,
    description: str,
    severity: str,
    action: str,
    protocol: Optional[str],
    conditions: RuleConditions,
    enabled: bool = True,
    position: Optional[int] = None
) -> Rule:
    """
    Create, validate, and persist a new firewall rule.
    """

    rule: Rule = {
        "rule_id": str(uuid.uuid4()),
        "name": name,
        "description": description,
        "severity": severity,
        "action": action,
        "protocol": protocol,
        "conditions": conditions,
        "enabled": enabled,
        "position": position
    }

    if not validate_rule(rule):
        raise ValueError("Invalid rule schema or values")

    rules = _load_rules_from_disk()
    
    # Handle positioning
    if position is not None and 0 <= position < len(rules):
        rules.insert(position, rule)
    else:
        rules.append(rule)
        
    # Re-normalize positions (optional but good for consistency)
    for i, r in enumerate(rules):
        r["position"] = i

    _save_rules_to_disk(rules)

    return rule


def move_rule(rule_id: str, new_position: int) -> bool:
    """
    Move a rule to a new index in the evaluation order.
    """
    rules = _load_rules_from_disk()
    rule_to_move = None
    old_index = -1

    # Find rule
    for i, r in enumerate(rules):
        if r.get("rule_id") == rule_id:
            rule_to_move = r
            old_index = i
            break
    
    if rule_to_move is None:
        return False

    # Remove from old position
    rules.pop(old_index)

    # Insert at new position (clamped to bounds)
    target_index = max(0, min(new_position, len(rules)))
    rules.insert(target_index, rule_to_move)

    # Update position fields
    for i, r in enumerate(rules):
        r["position"] = i

    _save_rules_to_disk(rules)
    return True


def get_all_rules(include_disabled: bool = False) -> List[Rule]:
    """
    Retrieve all stored firewall rules.
    """

    rules = _load_rules_from_disk()

    if include_disabled:
        return rules

    return [rule for rule in rules if rule.get("enabled") is True]


def get_rule_by_id(rule_id: str) -> Optional[Rule]:
    """
    Fetch a single rule by rule_id.
    """

    rules = _load_rules_from_disk()

    for rule in rules:
        if rule.get("rule_id") == rule_id:
            return rule

    return None


def disable_rule(rule_id: str) -> bool:
    """
    Disable a firewall rule without deleting it.
    """

    rules = _load_rules_from_disk()
    updated = False

    for rule in rules:
        if rule.get("rule_id") == rule_id:
            rule["enabled"] = False
            updated = True
            break

    if updated:
        _save_rules_to_disk(rules)

    return updated


def delete_rule(rule_id: str) -> bool:
    """
    Permanently delete a firewall rule.
    """

    rules = _load_rules_from_disk()
    new_rules = [rule for rule in rules if rule.get("rule_id") != rule_id]

    if len(new_rules) == len(rules):
        return False

    _save_rules_to_disk(new_rules)
    return True


def update_rule(rule_id: str, updates: dict) -> Optional[Rule]:
    """
    Update fields of an existing rule.
    """
    rules = _load_rules_from_disk()
    target_rule = None
    target_idx = -1

    for i, rule in enumerate(rules):
        if rule.get("rule_id") == rule_id:
            target_rule = rule
            target_idx = i
            break
            
    if target_rule is None:
        return None
        
    # Apply updates
    # We should validate, but for now we trust the caller partially 
    # and re-validate the whole object
    updated_rule = target_rule.copy()
    updated_rule.update(updates)
    
    # Ensure rule_id is not changed
    updated_rule["rule_id"] = rule_id
    
    if not validate_rule(updated_rule):
         raise ValueError("Invalid rule schema or values in update")
         
    rules[target_idx] = updated_rule
    _save_rules_to_disk(rules)
    
    return updated_rule


def toggle_rule(rule_id: str, enabled: bool) -> Optional[Rule]:
    """
    Enable or disable a rule.
    """
    return update_rule(rule_id, {"enabled": enabled})
