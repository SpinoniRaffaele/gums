export class Element {
  constructor(
      public nativeObject,
      public type: ElementType,
      public speed,
      public id: string) {}
}

export enum ElementType {
  USER = "user",
  PROJECT = "project"
}

export class User {
  constructor(
      public id: string,
      public name: string,
      public email: string,
      public age: number,
      public isAdmin: boolean
  ) {}
}

export class FullUser extends User {
  constructor(
      public id: string,
      public name: string,
      public email: string,
      public age: number,
      public isAdmin: boolean,
      public adminKey: string,
      public password: string
  ) {
    super(id, name, email, age, isAdmin);
  }
}

export class Project {
  constructor(
      public id: string,
      public name: string,
      public content: any,
      public collaboratorIds: string[],
      public linkedProjectIds: string[],
      public ownerId: string,
      public properties: any,
  ) {}
}