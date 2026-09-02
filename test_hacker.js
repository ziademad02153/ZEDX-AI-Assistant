
fetch('https://zedx-ai-simulator.vercel.app/api/payments/gumroad-webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'email=hacker@test.com&permalink=molojy'
}).then(res => res.json()).then(console.log);

