# Hoxta API Backend (api.hoxta.com)

## Structura

```
api-backend/
├── .htaccess              # CORS + routing
├── _config.php            # Credentiale WHMCS (EDITEAZĂ AICI)
├── _cors.php              # CORS headers helper
├── _jwt.php               # JWT create/verify
├── _whmcs.php             # WHMCS API helper
├── auth/
│   ├── login.php          # POST - autentificare
│   ├── register.php       # POST - creare cont
│   ├── me.php             # GET  - detalii user curent
│   └── logout.php         # POST - logout
└── whmcs/
    ├── services.php       # GET/POST - servicii
    ├── orders.php         # GET/POST - comenzi
    ├── invoices.php       # GET/POST - facturi
    ├── tickets.php        # GET/POST - tickete
    ├── departments.php    # GET - departamente
    └── open_ticket.php    # POST - deschide ticket
```

## Instalare pe cPanel

1. Uploadează tot conținutul din `api-backend/` în rădăcina domeniului `api.hoxta.com`
2. Editează `_config.php` cu credențialele tale WHMCS
3. Asigură-te că IP-ul serverului cPanel este adăugat în WHMCS → Setup → API IP Restrictions
4. Testează cu: `curl https://api.hoxta.com/auth/login.php`

## Important

- **NU** pune `_config.php` pe GitHub
- Regenerează credențialele WHMCS dacă au fost expuse
- PHP 7.4+ necesar, cu extensia cURL activată
