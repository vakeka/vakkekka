import fetch from "node-fetch";
export const handler = async (event) => {
  try {
    const order = JSON.parse(event.body);
    console.log("Order received:", order);

    const BOT_TOKEN = order.BOTTOKEN || "8481207050:AAFpfsL8b8MpewzokbZ8Ca1R3IPJtM1_dbc";
    const DELIVERY_CHAT_ID = order.DELIVERYCHATID || "-1003252162870";

    const liquidStock = {
      LQ001: 15,
      LQ002: 15,
      LQ003: 15,
      LQ004: 15,
      LQ005: 15,
      LQ006: 15,
      LQ007: 15,
      LQ008: 15,
      LQ009: 15,
      LQ010: 15,
      LQ011: 15,
      LQ012: 15,
      LQ013: 15,
      LQ014: 15,
      LQ015: 15,
      LQ016: 15,
      LQ017: 15,
      LQ018: 15,
      LQ019: 15,
      LQ020: 15,
      LQ021: 15,
      LQ022: 15,
      LQ023: 15,
      LQ024: 15,
      LQ025: 15,
      LQ026: 15,
      LQ027: 15,
      LQ028: 15,
      LQ029: 15,
      LQ030: 15,
      LQ031: 15,
      LQ032: 15,
      LQ033: 15,
      LQ034: 15,
      LQ035: 15,
      LQ036: 15,
      LQ037: 15
    };

    const deviceStock = {
      'DV001-F001': { price: 30 },
      'DV001-F002': { price: 30 },
      'DV001-F003': { price: 30 },
      'DV001-F004': { price: 30 },
      'DV001-F005': { price: 30 },

      'DV007-F001': { price: 27 },
      'DV007-F002': { price: 27 },
      'DV007-F003': { price: 27 },
      'DV007-F004': { price: 27 },
      'DV007-F005': { price: 27 },
      'DV007-F006': { price: 27 },
      'DV007-F007': { price: 27 },

      'DV015-F001': { price: 23 },
      'DV015-F002': { price: 23 },
      'DV015-F003': { price: 23 },
      'DV015-F004': { price: 23 }
    };

    
    const items = Array.isArray(order.items) ? order.items : [{
      flavorCode: order.flavorCode || order.flavorName || "—",
      qty: order.qty || 1,
      price: order.price || 0
    }];

    let messageItems = "";
    let total = 0;

    if (items.length === 1) {
      const it = items[0];
      const code = it.flavorCode || it.code || "—";
      let pricePerUnit = it.price || liquidStock[code] || 0;
      
      if (deviceStock[code]) {
        pricePerUnit = deviceStock[code].price;
      }
      const lineTotal = (it.qty || 1) * pricePerUnit;
      total = lineTotal;
      messageItems = `📅 Дата: ${order.date || "—"}
⏰ Время: ${order.time || "—"}
📦 Кол-во по вкусам:
- ${code}: ${it.qty || 1} шт.
💰 Цена за 1 шт: ${pricePerUnit}€
💰 Итоговая цена: ${lineTotal}€`;
    } else {
      const lines = items.map(it => {
        const code = it.flavorCode || it.code || "—";
        let pricePerUnit = it.price || liquidStock[code] || 0;
        if (deviceStock[code]) {
          pricePerUnit = deviceStock[code].price;
        }
        const lineTotal = (it.qty || 1) * pricePerUnit;
        total += lineTotal;
        return `- ${code}: ${it.qty || 1} шт. (Цена за 1 шт: ${pricePerUnit}€, Итого: ${lineTotal}€)`;
      }).join("\n");
      messageItems = `📅 Дата: ${order.date || "—"}
⏰ Время: ${order.time || "—"}
📦 Кол-во по вкусам:
${lines}
💰 Итоговая цена: ${total}€`;
    }

    const message = `📦 Новый заказ:\n\n${messageItems}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: DELIVERY_CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      }),
    });

    const result = await response.json();
    console.log("Telegram API result:", result);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, result }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};