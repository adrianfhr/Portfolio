# Dokploy Troubleshooting Guide

> 🎯 **Konteks:** Dokploy berjalan di port 3000. Web app Astro juga default di port 3000. VPS hanya punya 1 IP publik.

---

## 1. Masalah: Port Conflict Dokploy (3000) vs Web App (3000)

### ❌ Masalah
Dokploy panel berjalan di `http://157.10.161.40:3000`. Kalau web app juga expose port 3000, akan terjadi konflik.

### ✅ Solusi
Dokploy menggunakan **reverse proxy (Traefik)**. Jangan expose port web app ke publik langsung. Gunakan domain + Traefik:

```
User → Domain (portfolio.yourdomain.com) → Traefik (Dokploy) → Container Web (port 3000 internal)
```

**Di Dokploy panel, untuk app `portfolio-web`:**
1. Tab **Domains**
2. Add Domain: `portfolio.yourdomain.com`
3. Port: `3000` (internal container port)
4. **Jangan** expose port 3000 ke VPS publik

**Atau** kalau mau akses via IP + port berbeda:
- Ganti port mapping di Dokploy: `3001:3000` (host:container)
- Akses web di `http://157.10.161.40:3001`

---

## 2. Masalah: Web App REPLICAS 0/1 (Container Restart Terus)

### ❌ Error
```
> astro preview --port 3000 --host 0.0.0.0 --port 3000
sh: astro: not found
```

### ✅ Penyebab & Fix
**Penyebab:** Dockerfile runner stage hanya copy `dist/`, `node_modules/`, dan `package.json`. Tapi `astro preview` butuh `astro` CLI yang ada di `node_modules/.bin/`. Kalau `node_modules` tidak tercopy dengan benar, `astro` tidak ditemukan.

**Fix (sudah diapply):**
Ubah CMD dari:
```dockerfile
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```
Menjadi:
```dockerfile
CMD ["node", "./dist/server/entry.mjs"]
```

Karena Astro menggunakan `@astrojs/node` adapter dengan mode `standalone`, build menghasilkan file server di `dist/server/entry.mjs` yang bisa dijalankan langsung dengan `node` tanpa butuh `astro` CLI.

---

## 3. Masalah: API Tidak Bisa Di-hit dari Luar

### ❌ Gejala
- API running (log uvicorn OK)
- Tapi request dari browser/postman ke API timeout / connection refused

### ✅ Checklist

#### 3.1 Cek Port Terbuka
```bash
# Di VPS
sudo ss -tlnp | grep 8000
# atau
sudo netstat -tlnp | grep 8000
```

Kalau tidak muncul, berarti port tidak ter-expose.

#### 3.2 Cek Firewall
```bash
sudo ufw status
# atau
sudo iptables -L -n | grep 8000
```

Kalau firewall block, buka port:
```bash
sudo ufw allow 8000/tcp
```

#### 3.3 Cek Dokploy Domain/Port Mapping
Di Dokploy panel, untuk app `portfolio-api`:
1. Tab **Domains**
2. Add Domain: `api.portfolio.yourdomain.com`
3. Port: `8000`
4. Enable HTTPS

**Atau** kalau akses via IP:
- Pastikan di Dokploy app settings, port mapping expose `8000:8000`

#### 3.4 Cek CORS
Pastikan environment variable `CORS_ORIGINS` di Dokploy app `portfolio-api` mencakup domain web:
```
CORS_ORIGINS=https://portfolio.yourdomain.com,http://localhost:3000
```

---

## 4. Arsitektur Network yang Benar

```
┌─────────────────────────────────────────────────────────────┐
│                         VPS                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Dokploy (Traefik Reverse Proxy)          │   │
│  │                    Port: 3000                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐              │
│         ▼                  ▼                  ▼              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │  portfolio  │   │  portfolio  │   │  dokploy    │        │
│  │    -web     │   │    -api     │   │  internal   │        │
│  │  port 3000  │   │  port 8000  │   │             │        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
│                                                            │
│  Public Access:                                            │
│  - https://portfolio.yourdomain.com  → web (port 3000)     │
│  - https://api.portfolio.yourdomain.com → api (port 8000)  │
│  - http://157.10.161.40:3000 → Dokploy Panel               │
└─────────────────────────────────────────────────────────────┘
```

**Poin penting:**
- Web dan API tidak perlu expose port ke publik secara langsung
- Traefik (Dokploy) handle routing berdasarkan domain
- Port 3000 Dokploy panel dan port 3000 web app adalah **port yang berbeda dalam konteks yang berbeda**:
  - Port 3000 Dokploy = port host VPS
  - Port 3000 web app = port internal container

---

## 5. Quick Fix Commands

### Restart semua service
```bash
sudo docker service ls
sudo docker service update --force portfolio-api-ez2jum
sudo docker service update --force portfolio-web-neon0d
```

### Lihat logs real-time
```bash
sudo docker service logs -f portfolio-web-neon0d
sudo docker service logs -f portfolio-api-ez2jum
```

### Cek container health
```bash
sudo docker ps
sudo docker inspect <container_id> --format='{{.State.Health.Status}}'
```

---

## 6. Environment Variables Wajib di Dokploy

### API App (`portfolio-api`)
```
APP_NAME=Interactive AI Engineering Portfolio API
APP_ENV=production
CORS_ORIGINS=https://portfolio.yourdomain.com
```

### Web App (`portfolio-web`)
```
API_BASE_URL=https://api.portfolio.yourdomain.com
NODE_ENV=production
```

> ⚠️ **Penting:** `API_BASE_URL` harus menggunakan domain publik (bukan `http://api:8000` internal), karena web app SSR akan melakukan fetch dari server container ke API.

---

## 7. Checklist Deploy Berhasil

- [ ] Dokploy panel bisa diakses di `http://157.10.161.40:3000`
- [ ] GitHub App terinstall dan repository terhubung
- [ ] App `portfolio-api` dan `portfolio-web` terbuat
- [ ] Domain ditambahkan untuk masing-masing app
- [ ] Environment variables diisi
- [ ] Build berhasil (cek logs)
- [ ] API bisa diakses di `https://api.yourdomain.com/health`
- [ ] Web bisa diakses di `https://portfolio.yourdomain.com`
- [ ] Web bisa hit API (cek browser network tab)
