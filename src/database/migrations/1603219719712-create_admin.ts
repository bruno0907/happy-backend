import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createAdmin1603219719712 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'admin',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                      },
                      {
                        name: 'name',
                        type: 'varchar'
                      },
                      {
                        name: 'email',
                        type: 'varchar'
                      },
                      {
                        name: 'password',
                        type: 'varchar'
                      },
                      {
                        name: 'isAdmin',
                        type: 'boolean'
                      },
                      {
                        name: 'token',
                        type: 'varchar',
                        isNullable: true
                      }
                ]
            })
        )        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('admin')
    }

}
