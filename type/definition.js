import { inspect } from '../jsutils/inspect.js';
import { keyMap } from '../jsutils/keyMap.js';
import { mapValue } from '../jsutils/mapValue.js';
import { toObjMap } from '../jsutils/toObjMap.js';
import { devAssert } from '../jsutils/devAssert.js';
import { keyValMap } from '../jsutils/keyValMap.js';
import { instanceOf } from '../jsutils/instanceOf.js';
import { didYouMean } from '../jsutils/didYouMean.js';
import { isObjectLike } from '../jsutils/isObjectLike.js';
import { identityFunc } from '../jsutils/identityFunc.js';
import { suggestionList } from '../jsutils/suggestionList.js';
import { GraphQLError } from '../error/GraphQLError.js';
import { Kind } from '../language/kinds.js';
import { print } from '../language/printer.js';
import { valueFromASTUntyped } from '../utilities/valueFromASTUntyped.js';
export function isType(type) {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    isInputObjectType(type) ||
    isListType(type) ||
    isNonNullType(type)
  );
}
export function assertType(type) {
  if (!isType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL type.`);
  }

  return type;
}
/**
 * There are predicates for each kind of GraphQL type.
 */

// eslint-disable-next-line no-redeclare
export function isScalarType(type) {
  return instanceOf(type, GraphQLScalarType);
}
export function assertScalarType(type) {
  if (!isScalarType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL Scalar type.`);
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isObjectType(type) {
  return instanceOf(type, GraphQLObjectType);
}
export function assertObjectType(type) {
  if (!isObjectType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL Object type.`);
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isInterfaceType(type) {
  return instanceOf(type, GraphQLInterfaceType);
}
export function assertInterfaceType(type) {
  if (!isInterfaceType(type)) {
    throw new Error(
      `Expected ${inspect(type)} to be a GraphQL Interface type.`,
    );
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isUnionType(type) {
  return instanceOf(type, GraphQLUnionType);
}
export function assertUnionType(type) {
  if (!isUnionType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL Union type.`);
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isEnumType(type) {
  return instanceOf(type, GraphQLEnumType);
}
export function assertEnumType(type) {
  if (!isEnumType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL Enum type.`);
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isInputObjectType(type) {
  return instanceOf(type, GraphQLInputObjectType);
}
export function assertInputObjectType(type) {
  if (!isInputObjectType(type)) {
    throw new Error(
      `Expected ${inspect(type)} to be a GraphQL Input Object type.`,
    );
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isListType(type) {
  return instanceOf(type, GraphQLList);
}
export function assertListType(type) {
  if (!isListType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL List type.`);
  }

  return type;
}
// eslint-disable-next-line no-redeclare
export function isNonNullType(type) {
  return instanceOf(type, GraphQLNonNull);
}
export function assertNonNullType(type) {
  if (!isNonNullType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL Non-Null type.`);
  }

  return type;
}
/**
 * These types may be used as input types for arguments and directives.
 */

export function isInputType(type) {
  return (
    isScalarType(type) ||
    isEnumType(type) ||
    isInputObjectType(type) ||
    (isWrappingType(type) && isInputType(type.ofType))
  );
}
export function assertInputType(type) {
  if (!isInputType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL input type.`);
  }

  return type;
}
/**
 * These types may be used as output types as the result of fields.
 */

export function isOutputType(type) {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    (isWrappingType(type) && isOutputType(type.ofType))
  );
}
export function assertOutputType(type) {
  if (!isOutputType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL output type.`);
  }

  return type;
}
/**
 * These types may describe types which may be leaf values.
 */

export function isLeafType(type) {
  return isScalarType(type) || isEnumType(type);
}
export function assertLeafType(type) {
  if (!isLeafType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL leaf type.`);
  }

  return type;
}
/**
 * These types may describe the parent context of a selection set.
 */

export function isCompositeType(type) {
  return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}
export function assertCompositeType(type) {
  if (!isCompositeType(type)) {
    throw new Error(
      `Expected ${inspect(type)} to be a GraphQL composite type.`,
    );
  }

  return type;
}
/**
 * These types may describe the parent context of a selection set.
 */

export function isAbstractType(type) {
  return isInterfaceType(type) || isUnionType(type);
}
export function assertAbstractType(type) {
  if (!isAbstractType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL abstract type.`);
  }

  return type;
}
/**
 * List Type Wrapper
 *
 * A list is a wrapping type which points to another type.
 * Lists are often created within the context of defining the fields of
 * an object type.
 *
 * Example:
 *
 *     const PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         parents: { type: new GraphQLList(PersonType) },
 *         children: { type: new GraphQLList(PersonType) },
 *       })
 *     })
 *
 */

export class GraphQLList {
  constructor(ofType) {
    isType(ofType) ||
      devAssert(0, `Expected ${inspect(ofType)} to be a GraphQL type.`);
    this.ofType = ofType;
  }

  toString() {
    return '[' + String(this.ofType) + ']';
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLList';
  }
}
/**
 * Non-Null Type Wrapper
 *
 * A non-null is a wrapping type which points to another type.
 * Non-null types enforce that their values are never null and can ensure
 * an error is raised if this ever occurs during a request. It is useful for
 * fields which you can make a strong guarantee on non-nullability, for example
 * usually the id field of a database row will never be null.
 *
 * Example:
 *
 *     const RowType = new GraphQLObjectType({
 *       name: 'Row',
 *       fields: () => ({
 *         id: { type: new GraphQLNonNull(GraphQLString) },
 *       })
 *     })
 *
 * Note: the enforcement of non-nullability occurs within the executor.
 */

export class GraphQLNonNull {
  constructor(ofType) {
    isNullableType(ofType) ||
      devAssert(
        0,
        `Expected ${inspect(ofType)} to be a GraphQL nullable type.`,
      );
    this.ofType = ofType;
  }

  toString() {
    return String(this.ofType) + '!';
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLNonNull';
  }
}
/**
 * These types wrap and modify other types
 */

export function isWrappingType(type) {
  return isListType(type) || isNonNullType(type);
}
export function assertWrappingType(type) {
  if (!isWrappingType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL wrapping type.`);
  }

  return type;
}
/**
 * These types can all accept null as a value.
 */

export function isNullableType(type) {
  return isType(type) && !isNonNullType(type);
}
export function assertNullableType(type) {
  if (!isNullableType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL nullable type.`);
  }

  return type;
}
/* eslint-disable no-redeclare */

export function getNullableType(type) {
  /* eslint-enable no-redeclare */
  if (type) {
    return isNonNullType(type) ? type.ofType : type;
  }
}
/**
 * These named types do not include modifiers like List or NonNull.
 */

export function isNamedType(type) {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    isInputObjectType(type)
  );
}
export function assertNamedType(type) {
  if (!isNamedType(type)) {
    throw new Error(`Expected ${inspect(type)} to be a GraphQL named type.`);
  }

  return type;
}
/* eslint-disable no-redeclare */

export function getNamedType(type) {
  /* eslint-enable no-redeclare */
  if (type) {
    let unwrappedType = type;

    while (isWrappingType(unwrappedType)) {
      unwrappedType = unwrappedType.ofType;
    }

    return unwrappedType;
  }
}
/**
 * Used while defining GraphQL types to allow for circular references in
 * otherwise immutable type definitions.
 */

function resolveArrayThunk(thunk) {
  return typeof thunk === 'function' ? thunk() : thunk;
}

function resolveObjMapThunk(thunk) {
  return typeof thunk === 'function' ? thunk() : thunk;
}
/**
 * Scalar Type Definition
 *
 * The leaf values of any request and input values to arguments are
 * Scalars (or Enums) and are defined with a name and a series of functions
 * used to parse input from ast or variables and to ensure validity.
 *
 * If a type's serialize function does not return a value (i.e. it returns
 * `undefined`) then an error will be raised and a `null` value will be returned
 * in the response. If the serialize function returns `null`, then no error will
 * be included in the response.
 *
 * Example:
 *
 *     const OddType = new GraphQLScalarType({
 *       name: 'Odd',
 *       serialize(value) {
 *         if (value % 2 === 1) {
 *           return value;
 *         }
 *       }
 *     });
 *
 */

export class GraphQLScalarType {
  constructor(config) {
    const parseValue = config.parseValue ?? identityFunc;
    this.name = config.name;
    this.description = config.description;
    this.specifiedByUrl = config.specifiedByUrl;
    this.serialize = config.serialize ?? identityFunc;
    this.parseValue = parseValue;

    this.parseLiteral =
      config.parseLiteral ??
      ((node, variables) => parseValue(valueFromASTUntyped(node, variables)));

    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes ?? [];
    typeof config.name === 'string' || devAssert(0, 'Must provide name.');
    config.specifiedByUrl == null ||
      typeof config.specifiedByUrl === 'string' ||
      devAssert(
        0,
        `${this.name} must provide "specifiedByUrl" as a string, ` +
          `but got: ${inspect(config.specifiedByUrl)}.`,
      );
    config.serialize == null ||
      typeof config.serialize === 'function' ||
      devAssert(
        0,
        `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`,
      );

    if (config.parseLiteral) {
      (typeof config.parseValue === 'function' &&
        typeof config.parseLiteral === 'function') ||
        devAssert(
          0,
          `${this.name} must provide both "parseValue" and "parseLiteral" functions.`,
        );
    }
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByUrl: this.specifiedByUrl,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLScalarType';
  }
}

/**
 * Object Type Definition
 *
 * Almost all of the GraphQL types you define will be object types. Object types
 * have a name, but most importantly describe their fields.
 *
 * Example:
 *
 *     const AddressType = new GraphQLObjectType({
 *       name: 'Address',
 *       fields: {
 *         street: { type: GraphQLString },
 *         number: { type: GraphQLInt },
 *         formatted: {
 *           type: GraphQLString,
 *           resolve(obj) {
 *             return obj.number + ' ' + obj.street
 *           }
 *         }
 *       }
 *     });
 *
 * When two types need to refer to each other, or a type needs to refer to
 * itself in a field, you can use a function expression (aka a closure or a
 * thunk) to supply the fields lazily.
 *
 * Example:
 *
 *     const PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         name: { type: GraphQLString },
 *         bestFriend: { type: PersonType },
 *       })
 *     });
 *
 */
export class GraphQLObjectType {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.isTypeOf = config.isTypeOf;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes ?? [];
    this._fields = defineFieldMap.bind(undefined, config);
    this._interfaces = defineInterfaces.bind(undefined, config);
    typeof config.name === 'string' || devAssert(0, 'Must provide name.');
    config.isTypeOf == null ||
      typeof config.isTypeOf === 'function' ||
      devAssert(
        0,
        `${this.name} must provide "isTypeOf" as a function, ` +
          `but got: ${inspect(config.isTypeOf)}.`,
      );
  }

  getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }

    return this._fields;
  }

  getInterfaces() {
    if (typeof this._interfaces === 'function') {
      this._interfaces = this._interfaces();
    }

    return this._interfaces;
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLObjectType';
  }
}

function defineInterfaces(config) {
  const interfaces = resolveArrayThunk(config.interfaces ?? []);
  Array.isArray(interfaces) ||
    devAssert(
      0,
      `${config.name} interfaces must be an Array or a function which returns an Array.`,
    );
  return interfaces;
}

function defineFieldMap(config) {
  const fieldMap = resolveObjMapThunk(config.fields);
  isPlainObj(fieldMap) ||
    devAssert(
      0,
      `${config.name} fields must be an object with field names as keys or a function which returns such an object.`,
    );
  return mapValue(fieldMap, (fieldConfig, fieldName) => {
    isPlainObj(fieldConfig) ||
      devAssert(
        0,
        `${config.name}.${fieldName} field config must be an object.`,
      );
    fieldConfig.resolve == null ||
      typeof fieldConfig.resolve === 'function' ||
      devAssert(
        0,
        `${config.name}.${fieldName} field resolver must be a function if ` +
          `provided, but got: ${inspect(fieldConfig.resolve)}.`,
      );
    const argsConfig = fieldConfig.args ?? {};
    isPlainObj(argsConfig) ||
      devAssert(
        0,
        `${config.name}.${fieldName} args must be an object with argument names as keys.`,
      );
    const args = Object.entries(argsConfig).map(([argName, argConfig]) => ({
      name: argName,
      description: argConfig.description,
      type: argConfig.type,
      defaultValue: argConfig.defaultValue,
      deprecationReason: argConfig.deprecationReason,
      extensions: argConfig.extensions && toObjMap(argConfig.extensions),
      astNode: argConfig.astNode,
    }));
    return {
      name: fieldName,
      description: fieldConfig.description,
      type: fieldConfig.type,
      args,
      resolve: fieldConfig.resolve,
      subscribe: fieldConfig.subscribe,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: fieldConfig.extensions && toObjMap(fieldConfig.extensions),
      astNode: fieldConfig.astNode,
    };
  });
}

function isPlainObj(obj) {
  return isObjectLike(obj) && !Array.isArray(obj);
}

function fieldsToFieldsConfig(fields) {
  return mapValue(fields, (field) => ({
    description: field.description,
    type: field.type,
    args: argsToArgsConfig(field.args),
    resolve: field.resolve,
    subscribe: field.subscribe,
    deprecationReason: field.deprecationReason,
    extensions: field.extensions,
    astNode: field.astNode,
  }));
}
/**
 * @internal
 */

export function argsToArgsConfig(args) {
  return keyValMap(
    args,
    (arg) => arg.name,
    (arg) => ({
      description: arg.description,
      type: arg.type,
      defaultValue: arg.defaultValue,
      deprecationReason: arg.deprecationReason,
      extensions: arg.extensions,
      astNode: arg.astNode,
    }),
  );
}
export function isRequiredArgument(arg) {
  return isNonNullType(arg.type) && arg.defaultValue === undefined;
}

/**
 * Interface Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Interface type
 * is used to describe what types are possible, what fields are in common across
 * all types, as well as a function to determine which type is actually used
 * when the field is resolved.
 *
 * Example:
 *
 *     const EntityType = new GraphQLInterfaceType({
 *       name: 'Entity',
 *       fields: {
 *         name: { type: GraphQLString }
 *       }
 *     });
 *
 */
export class GraphQLInterfaceType {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes ?? [];
    this._fields = defineFieldMap.bind(undefined, config);
    this._interfaces = defineInterfaces.bind(undefined, config);
    typeof config.name === 'string' || devAssert(0, 'Must provide name.');
    config.resolveType == null ||
      typeof config.resolveType === 'function' ||
      devAssert(
        0,
        `${this.name} must provide "resolveType" as a function, ` +
          `but got: ${inspect(config.resolveType)}.`,
      );
  }

  getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }

    return this._fields;
  }

  getInterfaces() {
    if (typeof this._interfaces === 'function') {
      this._interfaces = this._interfaces();
    }

    return this._interfaces;
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLInterfaceType';
  }
}

/**
 * Union Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Union type
 * is used to describe what types are possible as well as providing a function
 * to determine which type is actually used when the field is resolved.
 *
 * Example:
 *
 *     const PetType = new GraphQLUnionType({
 *       name: 'Pet',
 *       types: [ DogType, CatType ],
 *       resolveType(value) {
 *         if (value instanceof Dog) {
 *           return DogType;
 *         }
 *         if (value instanceof Cat) {
 *           return CatType;
 *         }
 *       }
 *     });
 *
 */
export class GraphQLUnionType {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes ?? [];
    this._types = defineTypes.bind(undefined, config);
    typeof config.name === 'string' || devAssert(0, 'Must provide name.');
    config.resolveType == null ||
      typeof config.resolveType === 'function' ||
      devAssert(
        0,
        `${this.name} must provide "resolveType" as a function, ` +
          `but got: ${inspect(config.resolveType)}.`,
      );
  }

  getTypes() {
    if (typeof this._types === 'function') {
      this._types = this._types();
    }

    return this._types;
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLUnionType';
  }
}

function defineTypes(config) {
  const types = resolveArrayThunk(config.types);
  Array.isArray(types) ||
    devAssert(
      0,
      `Must provide Array of types or a function which returns such an array for Union ${config.name}.`,
    );
  return types;
}

/**
 * Enum Type Definition
 *
 * Some leaf values of requests and input values are Enums. GraphQL serializes
 * Enum values as strings, however internally Enums can be represented by any
 * kind of type, often integers.
 *
 * Example:
 *
 *     const RGBType = new GraphQLEnumType({
 *       name: 'RGB',
 *       values: {
 *         RED: { value: 0 },
 *         GREEN: { value: 1 },
 *         BLUE: { value: 2 }
 *       }
 *     });
 *
 * Note: If a value is not provided in a definition, the name of the enum value
 * will be used as its internal value.
 */
export class GraphQLEnumType {
  /* <T> */
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes ?? [];
    this._values = defineEnumValues(this.name, config.values);
    this._valueLookup = new Map(
      this._values.map((enumValue) => [enumValue.value, enumValue]),
    );
    this._nameLookup = keyMap(this._values, (value) => value.name);
    typeof config.name === 'string' || devAssert(0, 'Must provide name.');
  }

  getValues() {
    return this._values;
  }

  getValue(name) {
    return this._nameLookup[name];
  }

  serialize(outputValue) {
    const enumValue = this._valueLookup.get(outputValue);

    if (enumValue === undefined) {
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent value: ${inspect(outputValue)}`,
      );
    }

    return enumValue.name;
  }

  parseValue(inputValue) /* T */
  {
    if (typeof inputValue !== 'string') {
      const valueStr = inspect(inputValue);
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent non-string value: ${valueStr}.` +
          didYouMeanEnumValue(this, valueStr),
      );
    }

    const enumValue = this.getValue(inputValue);

    if (enumValue == null) {
      throw new GraphQLError(
        `Value "${inputValue}" does not exist in "${this.name}" enum.` +
          didYouMeanEnumValue(this, inputValue),
      );
    }

    return enumValue.value;
  }

  parseLiteral(valueNode, _variables) /* T */
  {
    // Note: variables will be resolved to a value before calling this function.
    if (valueNode.kind !== Kind.ENUM) {
      const valueStr = print(valueNode);
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` +
          didYouMeanEnumValue(this, valueStr),
        valueNode,
      );
    }

    const enumValue = this.getValue(valueNode.value);

    if (enumValue == null) {
      const valueStr = print(valueNode);
      throw new GraphQLError(
        `Value "${valueStr}" does not exist in "${this.name}" enum.` +
          didYouMeanEnumValue(this, valueStr),
        valueNode,
      );
    }

    return enumValue.value;
  }

  toConfig() {
    const values = keyValMap(
      this.getValues(),
      (value) => value.name,
      (value) => ({
        description: value.description,
        value: value.value,
        deprecationReason: value.deprecationReason,
        extensions: value.extensions,
        astNode: value.astNode,
      }),
    );
    return {
      name: this.name,
      description: this.description,
      values,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLEnumType';
  }
}

function didYouMeanEnumValue(enumType, unknownValueStr) {
  const allNames = enumType.getValues().map((value) => value.name);
  const suggestedValues = suggestionList(unknownValueStr, allNames);
  return didYouMean('the enum value', suggestedValues);
}

function defineEnumValues(typeName, valueMap) {
  isPlainObj(valueMap) ||
    devAssert(
      0,
      `${typeName} values must be an object with value names as keys.`,
    );
  return Object.entries(valueMap).map(([valueName, valueConfig]) => {
    isPlainObj(valueConfig) ||
      devAssert(
        0,
        `${typeName}.${valueName} must refer to an object with a "value" key ` +
          `representing an internal value but got: ${inspect(valueConfig)}.`,
      );
    return {
      name: valueName,
      description: valueConfig.description,
      value: valueConfig.value !== undefined ? valueConfig.value : valueName,
      deprecationReason: valueConfig.deprecationReason,
      extensions: valueConfig.extensions && toObjMap(valueConfig.extensions),
      astNode: valueConfig.astNode,
    };
  });
}

/**
 * Input Object Type Definition
 *
 * An input object defines a structured collection of fields which may be
 * supplied to a field argument.
 *
 * Using `NonNull` will ensure that a value must be provided by the query
 *
 * Example:
 *
 *     const GeoPoint = new GraphQLInputObjectType({
 *       name: 'GeoPoint',
 *       fields: {
 *         lat: { type: new GraphQLNonNull(GraphQLFloat) },
 *         lon: { type: new GraphQLNonNull(GraphQLFloat) },
 *         alt: { type: GraphQLFloat, defaultValue: 0 },
 *       }
 *     });
 *
 */
export class GraphQLInputObjectType {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes ?? [];
    this._fields = defineInputFieldMap.bind(undefined, config);
    typeof config.name === 'string' || devAssert(0, 'Must provide name.');
  }

  getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }

    return this._fields;
  }

  toConfig() {
    const fields = mapValue(this.getFields(), (field) => ({
      description: field.description,
      type: field.type,
      defaultValue: field.defaultValue,
      extensions: field.extensions,
      astNode: field.astNode,
    }));
    return {
      name: this.name,
      description: this.description,
      fields,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
    };
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return this.toString();
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  get [Symbol.toStringTag]() {
    return 'GraphQLInputObjectType';
  }
}

function defineInputFieldMap(config) {
  const fieldMap = resolveObjMapThunk(config.fields);
  isPlainObj(fieldMap) ||
    devAssert(
      0,
      `${config.name} fields must be an object with field names as keys or a function which returns such an object.`,
    );
  return mapValue(fieldMap, (fieldConfig, fieldName) => {
    !('resolve' in fieldConfig) ||
      devAssert(
        0,
        `${config.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`,
      );
    return {
      name: fieldName,
      description: fieldConfig.description,
      type: fieldConfig.type,
      defaultValue: fieldConfig.defaultValue,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: fieldConfig.extensions && toObjMap(fieldConfig.extensions),
      astNode: fieldConfig.astNode,
    };
  });
}

export function isRequiredInputField(field) {
  return isNonNullType(field.type) && field.defaultValue === undefined;
}
