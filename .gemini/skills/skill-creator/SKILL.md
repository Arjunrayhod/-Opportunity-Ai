---
name: skill-creator
description: Scaffold, test, validate, and publish high-quality modular agent skills conforming to the AgentSkills open standard.
---

# Skill Creator & Agent Skills Engineering

## Skill Structure Standard
Every skill must reside in its own folder and contain a `SKILL.md` with standard YAML frontmatter:

```yaml
---
name: my-skill-name
description: Clear, 1-2 sentence description explaining when and why an agent should invoke this skill.
---
```

## Best Practices
1. **Actionable Instructions**: Structure guidelines with bulleted rules, code snippets, and verification checklists.
2. **Deterministic Outputs**: Avoid ambiguity by specifying concrete schemas, file formats, and execution workflows.
3. **Reference Modularization**: Store large keyword banks, scoring rubrics, or API references inside a `references/` subfolder.
