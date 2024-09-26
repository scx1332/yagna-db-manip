import Database from 'better-sqlite3';
import BigNumber from "bignumber.js";

function order_item_documents() {
    const db = new Database('payment.db');
    db.transaction(() => {
        let query = `
            SELECT pboid.order_id,
                   pbo.owner_id,
                   pbo.payer_addr,
                   pbo.platform,
                   pboid.payee_addr,
                   pboid.allocation_id,
                   pboi.amount as pboi_amount,
                   pboid.amount,
                   pboid.agreement_id,
                   pboid.activity_id
            FROM pay_batch_order_item pboi
                     JOIN pay_batch_order_item_document pboid
                          ON pboid.order_id = pboi.order_id
                              AND pboid.owner_id = pboi.owner_id
                              AND pboid.payee_addr = pboi.payee_addr
                              AND pboid.allocation_id = pboi.allocation_id
                     JOIN pay_batch_order pbo ON pbo.owner_id = pboi.owner_id AND pbo.id = pboi.order_id
            `;
        let rows = db.prepare(query).all();
        let sumAmount = BigNumber(0);
        let order = {}
        let order_item = {}
        let payee_addr = {}
        rows.forEach(row => {
            payee_addr[row.payee_addr] = true;
            order[row.order_id] = true;
            order_item[row.order_id + "_" + row.payee_addr + "_" + row.allocation_id] = row.pboi_amount;
            let amount = BigNumber(row.amount);
            sumAmount = sumAmount.plus(amount);

         });

        let sumOrderItemAmount = BigNumber(0);
        for (const order_value of Object.values(order_item)) {
            sumOrderItemAmount = sumOrderItemAmount.plus(order_value);
        }


        console.log("Summary of orders:");
        console.log("Number of orders: ", Object.keys(order).length);
        console.log("Number of order items: ", Object.keys(order_item).length);
        console.log("Number of order item documents: ", rows.length);
        console.log("Number of payee addresses: ", Object.keys(payee_addr).length);
        console.log("Total order item amount: ", sumOrderItemAmount.toString());
        console.log("Total order item documents amount: ", sumAmount.toString());
    })();
}


function order_items() {
    const db = new Database('payment.db');
    db.transaction(() => {
        let query = `
            SELECT pboi.order_id,
                   pbo.owner_id,
                   pbo.payer_addr,
                   pbo.platform,
                   pboi.payee_addr,
                   pboi.allocation_id,
                   amount
            FROM pay_batch_order_item pboi
                     JOIN pay_batch_order pbo ON pbo.owner_id = pboi.owner_id AND pbo.id = pboi.order_id
            `;
        let rows = db.prepare(query).all();
        let sumAmount = BigNumber(0);
        let order = {}
        rows.forEach(row => {
                console.log(`${row.allocation_id} ${row.amount}`);
                let amount = BigNumber(row.amount);

                order[row.order_id] = true;
                sumAmount = sumAmount.plus(amount);

        });

        console.log("Number of orders: ", Object.keys(order).length);
        console.log("Number of order items: ", rows.length);
        console.log("Total order item amount: ", sumAmount.toString());
    })();
}

order_item_documents()