import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import BigNumber from "bignumber.js";
import {formatDatePaymentsFormat} from './utils.js';
import {
    createAgreement,
    insertAgreement,
    increaseAgreementAmountDue, getAgreement, increaseAgreementAmountAccepted
} from './aggreement.js';
import {
    createActivity,
    increaseActivityAndAgreementAmountAccepted,
    increaseActivityAndAgreementAmountDue,
    insertActivity
} from "./activity.js";
import {createDebitNote, getLastDebitNote, insertDebitNote} from "./debit.js";
import {createInvoice, insertInvoice} from "./invoice.js";





function order_items_document() {
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
        rows.forEach(row => {

            if (row.order_id === '9802f970-9387-4e03-8be1-a13145d18267') {
                console.log(row);
                let amount = BigNumber(row.amount);
                sumAmount = sumAmount.plus(amount);
            }

        });
        console.log("Total amount: ", sumAmount.toString());
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
        rows.forEach(row => {
            if (row.order_id === '9802f970-9387-4e03-8be1-a13145d18267') {
                console.log(`${row.allocation_id} ${row.amount}`);
                let amount = BigNumber(row.amount);

                sumAmount = sumAmount.plus(amount);
            }

        });

        console.log("Total amount: ", sumAmount.toString());


    })();
}

order_items()