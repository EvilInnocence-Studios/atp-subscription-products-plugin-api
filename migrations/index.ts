import { insertPermissions } from "../../uac/migrations/util";
import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";

const db = database();

export const migrations:IMigration[] = [{
    name: "init",
    module: "subscription-products-plugin",
    description: "Initialize the subscription products database schema with products and permissions.",
    order: 0,
    down: () => db.schema
        .alterTable("products", (t) => {
            t.dropColumn("subscriptionOnly");
        }),
    up: () => db.schema
        .alterTable("products", (t) => {
            t.boolean("subscriptionOnly").notNullable().defaultTo(false);
        }),
    initData: () => Promise.all([
        insertPermissions(db, [
            { name: "product.subscription", description: "Can purchase subscription-only products" },
        ]),
    ]),
}];
