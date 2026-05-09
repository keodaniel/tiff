# Local Dev & Mobile Preview

## Daily workflow

```bash
npm run dev -- --host   # visual/component work — HMR, no rebuild needed
npm run preview         # Cloudflare testing (admin, KV, env vars) — requires full rebuild
```

`npm run dev` binds Astro to `0.0.0.0:4321` with `--host`. Skip `--host` if you only need localhost.

---

## Viewing on mobile (WSL + WiFi)

Running from WSL requires forwarding the port from Windows to WSL so your phone can reach it.

### 1. Start the dev server (WSL)

```bash
npm run dev -- --host
```

Note the WSL IP Astro prints, or grab it manually:

```bash
ip addr show eth0 | grep 'inet '
# → inet 172.x.x.x/20 ...
```

### 2. Forward the port (PowerShell — run as Administrator)

Replace `<WSL_IP>` with the address from step 1:

```powershell
netsh interface portproxy add v4tov4 `
  listenport=4321 listenaddress=0.0.0.0 `
  connectport=4321 connectaddress=<WSL_IP>
```

Find your Windows LAN IP to share with your phone:

```powershell
ipconfig
# look for IPv4 Address under your WiFi adapter → 192.168.x.x
```

### 3. Open on your phone

Phone must be on the same WiFi network:

```
http://<Windows_LAN_IP>:4321
```

### Cleanup

Remove the proxy rule when done (it persists across reboots):

```powershell
netsh interface portproxy delete v4tov4 listenport=4321 listenaddress=0.0.0.0
```

---

## Notes

- **WSL IP changes on restart** — re-run the `portproxy add` command with the new IP each session.
- **Windows Firewall** — if your phone can't connect, temporarily allow port 4321:
  ```powershell
  New-NetFirewallRule -DisplayName "Astro Dev" -Direction Inbound -Protocol TCP -LocalPort 4321 -Action Allow
  ```
  Remove it when done: `Remove-NetFirewallRule -DisplayName "Astro Dev"`
- **View active proxy rules**: `netsh interface portproxy show all`
- **Admin panel** needs `npm run preview` — KV and session secrets aren't available in `astro dev`.
