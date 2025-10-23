app.get("/age-gate", (req, res) => {
  const ageVerified = req.cookies?.ageVerified;
  if (ageVerified === "true") {
    return res.redirect("/login");
  }
  if (ageVerified === "false") {
    return res.send(`
      <html><head><meta charset="utf-8"><title>Доступ запрещён</title></head>
      <body style="background:#151516;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;">
          <h2>Извините, доступ запрещён</h2>
          <p>Вы должны быть старше 18 лет, чтобы использовать этот сайт.</p>
        </div>
      </body></html>
    `);
  }
  res.send(`
    <html><head><meta charset="utf-8"><title>Подтверждение возраста</title>
    <style>
      body{background:#151516;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
      .box{background:#232426;padding:28px;border-radius:12px;box-shadow:0 0 20px rgba(0,0,0,0.5);width:320px;text-align:center}
      button{width:100px;padding:10px;margin:12px;border-radius:8px;border:0;background:#4c8bf5;color:#fff;font-weight:700;cursor:pointer;margin:0 10px;}
    </style></head>
    <body>
      <div class="box">
        <h2>Вам есть 18 лет?</h2>
        <button onclick="submitAge(true)">Да</button>
        <button onclick="submitAge(false)">Нет</button>
      </div>
      <script>
        function submitAge(isAdult) {
          document.cookie = 'ageVerified=' + isAdult + '; Path=/; Max-Age=' + (60*60*24*30);
          if(isAdult) {
            window.location.href = '/login';
          } else {
            window.location.reload();
          }
        }
      </script>
    </body></html>
  `);
});

app.use((req, res, next) => {
  if (req.path === "/age-gate" || req.path === "/login" || req.path === "/health") {
    return next();
  }
  const ageVerified = req.cookies?.ageVerified;
  if (ageVerified === "true") {
    return next();
  }
  res.redirect("/age-gate");
});

import cookieParser from "cookie-parser";
app.use(cookieParser());