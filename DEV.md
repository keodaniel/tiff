# Local Dev & Mobile Preview

Running the dev server from WSL with phone testing over WiFi requires two steps: start Astro bound to all interfaces, then forward the port from Windows to WSL.

## 1. Start the dev server (WSL)

```bash
cd /mnt/c/WSD/Projects/tiff
npm run dev -- --host
```

`--host` binds Astro to `0.0.0.0:4321` instead of localhost only.

Note the WSL IP Astro prints, or grab it manually:

```bash
ip addr show eth0 | grep 'inet '
# → inet 172.x.x.x/20 ...
```

## 2. Forward the port (PowerShell — run as Administrator)

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

## 3. Open on your phone

Phone must be on the same WiFi network. Navigate to:

```
http://<Windows_LAN_IP>:4321
```

## Cleanup

Remove the proxy rule when done (otherwise it persists across reboots):

```powershell
netsh interface portproxy delete v4tov4 listenport=4321 listenaddress=0.0.0.0
```

## Notes

- **WSL IP changes on restart** — re-run the `portproxy add` command with the new IP each session.
- **Windows Firewall** — if your phone can't connect, temporarily allow port 4321:
  ```powershell
  New-NetFirewallRule -DisplayName "Astro Dev" -Direction Inbound -Protocol TCP -LocalPort 4321 -Action Allow
  ```
  Remove it when done: `Remove-NetFirewallRule -DisplayName "Astro Dev"`
- **View active proxy rules**: `netsh interface portproxy show all`
