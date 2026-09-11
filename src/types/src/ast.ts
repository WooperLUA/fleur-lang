export enum NodeType
{
    Program = "Program",
    VariableDeclaration = "VariableDeclaration",
    FunctionDeclaration = "FunctionDeclaration",
    ProcedureDeclaration = "ProcedureDeclaration",
    StructDeclaration = "StructDeclaration",
    IfStatement = "IfStatement",
    WhenStatement = "WhenStatement",
    ForStatement = "ForStatement",
    WhileStatement = "WhileStatement",
    ReturnStatement = "ReturnStatement",
    BlockStatement = "BlockStatement",
    ExpressionStatement = "ExpressionStatement",
    TryStatement = "TryStatement",
    ImportStatement = "ImportStatement",

    BinaryExpression = "BinaryExpression",
    UnaryExpression = "UnaryExpression",
    Identifier = "Identifier",
    NumericLiteral = "NumericLiteral",
    StringLiteral = "StringLiteral",
    BooleanLiteral = "BooleanLiteral",
    NullLiteral = "NullLiteral",
    ArrayLiteral = "ArrayLiteral",
    StructLiteral = "StructLiteral",
    CallExpression = "CallExpression",
    MemberExpression = "MemberExpression",
    IndexExpression = "IndexExpression",
    AssignmentExpression = "AssignmentExpression",
    RangeExpression = "RangeExpression",
    MethodDeclaration = "MethodDeclaration",
    StaticMemberExpression = "StaticMemberExpression",
    TypeAnnotation = "TypeAnnotation"
}

export type Node = {
    type: NodeType;
};

export type Program = Node & {
    type: NodeType.Program;
    body: Statement[];
};

export type Statement =
    | VariableDeclaration
    | FunctionDeclaration
    | ProcedureDeclaration
    | MethodDeclaration
    | StructDeclaration
    | IfStatement
    | WhenStatement
    | ForStatement
    | WhileStatement
    | ReturnStatement
    | BlockStatement
    | ExpressionStatement
    | TryStatement
    | ImportStatement;


export type TypeAnnotation = Node & {
    type: NodeType.TypeAnnotation;
    name: string;
};

export type Parameter = {
    name: string;
    type_annotation?: TypeAnnotation;
};

export type StructField = {
    name: string;
    type_annotation?: TypeAnnotation;
};

export type VariableDeclaration = Node & {
    type: NodeType.VariableDeclaration;
    identifier: string;
    value: Expression;
    is_const: boolean;
    is_pub: boolean;
    type_annotation?: TypeAnnotation;
};

export type FunctionDeclaration = Node & {
    type: NodeType.FunctionDeclaration;
    identifier: string;
    parameters: Parameter[];
    body: BlockStatement;
    is_pub: boolean;
    return_type?: TypeAnnotation;
};

export type ProcedureDeclaration = Node & {
    type: NodeType.ProcedureDeclaration;
    identifier: string;
    parameters: Parameter[];
    body: BlockStatement;
    is_pub: boolean;
};

export type MethodDeclaration = Node & {
    type: NodeType.MethodDeclaration;
    struct_name: string;
    identifier: string;
    parameters: Parameter[];
    body: BlockStatement;
    return_type?: TypeAnnotation;
};

export type StructDeclaration = Node & {
    type: NodeType.StructDeclaration;
    identifier: string;
    fields: StructField[];
    is_pub: boolean;
};

export type IfStatement = Node & {
    type: NodeType.IfStatement;
    condition: Expression;
    consequent: BlockStatement;
    alternate?: BlockStatement | IfStatement;
};

export type WhenCase = {
    value: Expression | "else";
    body: BlockStatement;
};

export type WhenStatement = Node & {
    type: NodeType.WhenStatement;
    expression: Expression;
    cases: WhenCase[];
};

export type ForStatement = Node & {
    type: NodeType.ForStatement;
    identifier: string;
    iterable: Expression;
    body: BlockStatement;
};

export type WhileStatement = Node & {
    type: NodeType.WhileStatement;
    condition: Expression;
    body: BlockStatement;
};

export type ReturnStatement = Node & {
    type: NodeType.ReturnStatement;
    value: Expression;
};

export type BlockStatement = Node & {
    type: NodeType.BlockStatement;
    body: Statement[];
};

export type ExpressionStatement = Node & {
    type: NodeType.ExpressionStatement;
    expression: Expression;
};

export type TryStatement = Node & {
    type: NodeType.TryStatement;
    body: BlockStatement;
    catch_param: string;
    catch_body: BlockStatement;
};

export type ImportStatement = Node & {
    type: NodeType.ImportStatement;
    specifiers: string[]; // the things you want to import
    source: string;       // file path
};

export type Expression =
    | BinaryExpression
    | UnaryExpression
    | Identifier
    | NumericLiteral
    | StringLiteral
    | BooleanLiteral
    | NullLiteral
    | ArrayLiteral
    | StructLiteral
    | CallExpression
    | MemberExpression
    | StaticMemberExpression
    | IndexExpression
    | AssignmentExpression
    | RangeExpression;

export type BinaryExpression = Node & {
    type: NodeType.BinaryExpression;
    left: Expression;
    right: Expression;
    operator: string;
};

export type UnaryExpression = Node & {
    type: NodeType.UnaryExpression;
    operator: string;
    argument: Expression;
};

export type Identifier = Node & {
    type: NodeType.Identifier;
    name: string;
};

export type NumericLiteral = Node & {
    type: NodeType.NumericLiteral;
    value: number;
    is_float?: boolean;
};

export type StringLiteral = Node & {
    type: NodeType.StringLiteral;
    value: string;
};

export type BooleanLiteral = Node & {
    type: NodeType.BooleanLiteral;
    value: boolean;
};

export type NullLiteral = Node & {
    type: NodeType.NullLiteral;
};

export type ArrayLiteral = Node & {
    type: NodeType.ArrayLiteral;
    elements: Expression[];
};

export type StructProperty = {
    name: string;
    value: Expression;
};

export type StructLiteral = Node & {
    type: NodeType.StructLiteral;
    identifier: string;
    properties: StructProperty[];
};

export type CallExpression = Node & {
    type: NodeType.CallExpression;
    callee: Expression;
    arguments: Expression[];
};

export type MemberExpression = Node & {
    type: NodeType.MemberExpression;
    object: Expression;
    property: Identifier;
};

export type StaticMemberExpression = Node & {
    type: NodeType.StaticMemberExpression;
    object: Expression;
    property: Identifier;
};

export type IndexExpression = Node & {
    type: NodeType.IndexExpression;
    object: Expression;
    index: Expression;
};

export type AssignmentExpression = Node & {
    type: NodeType.AssignmentExpression;
    left: Expression;
    right: Expression;
    operator: string;
};

export type RangeExpression = Node & {
    type: NodeType.RangeExpression;
    start: Expression;
    end: Expression;
};
