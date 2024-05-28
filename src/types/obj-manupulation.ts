import { Type, Static, TSchema } from '@sinclair/typebox';

interface FilterByKeyParams<T extends TSchema> {
  base: T; // Base schema
  pick?: Array<keyof Static<T>>; // Fields to pick
  omit?: Array<keyof Static<T>>; // Fields to omit
  optional?: Array<keyof Static<T>>; // Fields to make optional
  merge?: TSchema; // Schema to merge with
}

function ObjTypeManupulation<T extends TSchema>({
  base,
  pick,
  omit,
  optional,
  merge
}: FilterByKeyParams<T>) {
  // Ensure pick and omit are not both present
  if (pick && omit) {
    throw new Error('pick and omit cannot both be present');
  }

  // Determine effective schema based on pick or omit
  let filteredType: TSchema;
  if (pick) {
    filteredType = Type.Pick(base, pick);
  } else if (omit) {
    filteredType = Type.Omit(base, omit);
  } else {
    filteredType = base;
  }

  // Make specified fields optional
  if (optional) {
    const partialFields = optional.reduce((acc, key) => {
      if (key in filteredType.properties) {
        acc[key as string] = Type.Optional(filteredType.properties[key as string]);
      }
      return acc;
    }, {} as Record<string, TSchema>);

    // Merge partialFields with the filtered type
    const partialType = Type.Object(partialFields);
    filteredType = Type.Intersect([filteredType, partialType]);
  }

  // Merge with additional type if provided
  if (merge) {
    filteredType = Type.Intersect([filteredType, merge]);
  }

  return filteredType;
}

export default ObjTypeManupulation
