import {Knex} from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    meals: {
      id: string;
      session_id: string;
      name: string;
      description: string;
      is_diet: boolean;
      created_at?: Date;
    }
  }
}