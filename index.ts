import { prop } from "ts-functional";
import { Setting } from "../common/setting/service";
import { IProduct } from "../store-shared/product/types";
import { registerFreeOrderValidator } from "../store/plugin/freeOrderValidator";
import { User } from "../uac/user/service";

export { apiConfig } from "./endpoints";

// If there are subscription only products in the order, make sure the user is a subscriber
registerFreeOrderValidator(async (userId: string, products: IProduct[]) => {
    const subscriptionProducts = products.filter((product) => product.subscriptionOnly);
    if(subscriptionProducts.length) {
        const role = await Setting.get("subscriptionRole");
        const userRoles = await User.roles.get(userId);

        if(!userRoles.map(prop("id")).includes(role)) {
            return [false, "User must be a subscriber to purchase subscription only products"];
        }
    }
    return [true, "Order is valid"];
});
    