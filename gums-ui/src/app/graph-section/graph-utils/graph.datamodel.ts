export class Element {
  constructor(
      public nativeObject,
      public type: ElementType,
      public speed,
      public id: string) {}
}

export enum ElementType {
  USER,
  PROJECT
}

export class User {
  constructor(
      public id: string,
      public name: string,
      public email: string,
      public age: number,
      isAdmin: boolean
  ) {}
}

export class Project {
  constructor(
      public id: string,
      public name: string,
      public content: any,
      public collaboratorIds: String[],
      public linkedProjectIds: String[],
      public ownerId: String,
      public properties: any,
  ) {}
}