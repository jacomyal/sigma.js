---
title: Style value types
sidebar:
  label: Style value types
---

Every [style property](/reference/style-properties/) accepts several value forms. This page documents each one.

## Literal

A fixed value applied to all elements.

```typescript
{ color: "#e22653", size: 10, label: "Hello" }
```

## Attribute binding

Reads a value from the element's graphology attributes.

```typescript
{ color: { attribute: "color", defaultValue: "#666" } }
```

| Field          | Type     | Required | Description                       |
| -------------- | -------- | -------- | --------------------------------- |
| `attribute`    | `string` | Yes      | Graphology attribute name to read |
| `defaultValue` | `T`      | No       | Fallback if attribute is missing  |

## Categorical binding

Maps discrete attribute values to outputs via a dictionary.

```typescript
{
  color: {
    attribute: "community",
    dict: { science: "#e22653", art: "#277da1", tech: "#666" },
    defaultValue: "#ccc",
  },
}
```

| Field          | Type                | Required | Description                                  |
| -------------- | ------------------- | -------- | -------------------------------------------- |
| `attribute`    | `string`            | Yes      | Attribute name to read                       |
| `dict`         | `Record<string, T>` | Yes      | Mapping from attribute values to outputs     |
| `defaultValue` | `T`                 | No       | Fallback if attribute value is not in `dict` |

## Numerical binding

Maps a numeric attribute to a min/max output range.

```typescript
{
  size: {
    attribute: "degree",
    min: 3,
    max: 20,
    minValue: 0,
    maxValue: 100,
    easing: "quadraticOut",
  },
}
```

| Field          | Type     | Required | Description                              |
| -------------- | -------- | -------- | ---------------------------------------- |
| `attribute`    | `string` | Yes      | Numeric attribute to read                |
| `min`          | `number` | No       | Output minimum                           |
| `max`          | `number` | No       | Output maximum                           |
| `minValue`     | `number` | No       | Input minimum (values below are clamped) |
| `maxValue`     | `number` | No       | Input maximum (values above are clamped) |
| `defaultValue` | `number` | No       | Fallback if the attribute is missing.    |
| `easing`       | `Easing` | No       | Interpolation curve (see below)          |

### Easing functions

Named: `"linear"`, `"quadraticIn"`, `"quadraticOut"`, `"quadraticInOut"`, `"cubicIn"`, `"cubicOut"`, `"cubicInOut"`, `"exponentialIn"`, `"exponentialOut"`, `"exponentialInOut"`

Custom easing: any `(t: number) => number` function where `t` goes from 0 to 1.

## Function

Full control via a callback. Receives the element's attributes, state, graph state, and the graph instance.

```typescript
{
  color: (attributes, state, graphState, graph) => {
    return state.isHovered ? "#e22653" : attributes.color;
  },
}
```

Signature: `(attributes: A, state: S, graphState: GS, graph: AbstractGraph) => T`

:::note
Sigma does **static analysis** on the styles declaration, to identify dependencies between items, attributes and state
fields. Using these custom functions instead prevents this static analysis, and will cause styles to be reevaluated much
more often.

In performance oriented applications that handle large graphs, you should try as much as possible to avoid those.
:::

## Inline conditional

A concise conditional within a single property.

```typescript
{
  size: {
    whenState: "isHovered",
    then: 15,
    else: { attribute: "size", defaultValue: 10 },
  },
}
```

| Field                             | Type              | Required | Description                              |
| --------------------------------- | ----------------- | -------- | ---------------------------------------- |
| `whenState` / `whenData` / `when` | predicate         | Yes      | Condition to test (see Predicates below) |
| `then`                            | `GraphicValue<T>` | Yes      | Value when condition is true             |
| `else`                            | `GraphicValue<T>` | No       | Value when condition is false            |

## Rule-level conditionals

When you need to change multiple properties based on the same condition, use a rule-level conditional instead of inline
conditionals on each property:

```typescript
styles: {
  nodes: [
    { color: { attribute: "color" }, size: { attribute: "size" } },
    {
      whenState: "isHovered",
      then: { size: 15, labelVisibility: "visible" },
    },
  ],
}
```

Rules are evaluated in order. Later rules override earlier ones for any properties they set.

## Rule-level match

When you need to apply different styles based on a categorical attribute (e.g. node type, edge kind), use a
`matchData`/`cases` rule. It selects a style block based on the value of a graph attribute:

```typescript
styles: {
  edges: [
    { color: "#ccc", size: 1 },
    {
      matchData: "type",
      cases: {
        citation: { color: "#0f0", head: "arrow" },
        coauthorship: { color: "#f00", size: 3 },
      },
    },
  ],
}
```

| Field       | Type                              | Required | Description                                   |
| ----------- | --------------------------------- | -------- | --------------------------------------------- |
| `matchData` | `string`                          | Yes      | Attribute name to read from the element       |
| `cases`     | `Record<string, StyleProperties>` | Yes      | Mapping from attribute values to style blocks |

If the attribute value doesn't match any case, the rule is skipped. Attribute values are coerced to strings for lookup
(so a numeric attribute `2` matches the key `"2"`).

Unlike function-based `when` predicates, `matchData`/`cases` only reads graph attributes, so sigma can skip
re-evaluation when only the interaction state changes (e.g. hovering). This makes it the preferred approach for
attribute-based branching on large graphs.

There is also `matchState` for branching on a **custom** state field. It takes a single state key
(`matchState: "status"`) and looks up the value of that field in `cases`. It's intended for categorical values you add
via the state generics (the built-in state flags are booleans and are better expressed with `whenState`).

## Predicates

Predicates drive `whenState`/`whenData`/`when` (inline and rule-level conditionals) and the `match*` rule variants.

**`whenState`** matches against element state flags:

| Form   | Example                                | Matches when                     |
| ------ | -------------------------------------- | -------------------------------- |
| String | `"isHovered"`                          | The named state flag is `true`   |
| Array  | `["isHovered", "isActive"]`            | ALL named flags are `true` (AND) |
| Object | `{ isHovered: true, isActive: false }` | All specified values match       |

**`whenData`** matches against graph attributes (same forms, but for attribute names/values). Re-evaluated only when
graph data changes, not on interaction state changes.

**`when`** takes a function for full control:

| Form     | Example                                    | Matches when                |
| -------- | ------------------------------------------ | --------------------------- |
| Function | `(attrs, state, graphState, graph) => ...` | The function returns `true` |

:::note
As stated above for style functions, using the `when` function predicates prevents static analysis, and will negatively
impact performances.
:::

**`matchData`** / **`matchState`** branch to a case block by attribute or state value:

| Form         | Example                                                     | Picks the case where                    |
| ------------ | ----------------------------------------------------------- | --------------------------------------- |
| `matchData`  | `{ matchData: "type", cases: { a: {...}, b: {...} } }`      | `attributes[type]` matches the case key |
| `matchState` | `{ matchState: "status", cases: { ok: {...}, ko: {...} } }` | `state[status]` matches the case key    |

Case keys are strings, and attribute/state values are coerced to strings for lookup. If no case matches, the rule is
skipped.
