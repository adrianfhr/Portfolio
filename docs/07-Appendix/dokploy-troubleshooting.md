# Dokploy Troubleshooting Guide

> 🎯 **Konteks:** Dokploy berjalan di port 3000. Web app Astro juga default di port 3000. VPS hanya punya 1 IP publik.

---

## 🔴 MASALAH KRITIS: API Tidak Bisa Diakses (Connection Refused)

### Gejala
```bash
curl http://localhost:8000/health
curl: (7) Failed to connect to localhost port 8000
```

### Penyebab
Dokploy menjalankan container dalam **Docker Swarm mode**, bukan docker-compose biasa. Container tidak otomatis bind ke port host VPS. Port harus di-expose via **Dokploy Domain/Port mapping**.

### Solusi Langsung

#### Opsi 1: Via Dokploy Domain (RECOMMENDED)
Tambahkan domain di Dokploy panel untuk app `portfolio-api`:
1. Buka app `portfolio-api` → tab **Domains**
2. Klik **Add Domain**
3. Isi:
   - Domain: `api.yourdomain.com` (atau subdomain)
   - Port: `8000`
   - HTTPS: Enable
4. Save

#### Opsi 2: Via Dokploy Port Mapping (IP Langsung)
Kalau mau akses via IP tanpa domain:
1. Buka app `portfolio-api` → tab **Advanced**
2. Cari **Port Mapping** atau **Expose Port**
3. Tambahkan: `8000:8000` (host:container)
4. Save & Redeploy

#### Opsi 3: Cek Container Running
```bash
# Lihat container yang jalan
sudo docker ps

# Lihat service Dokploy
sudo docker service ls

# Lihat logs API
sudo docker service logs -f portfolio-api-ez2jum

# Cek container detail (ganti <container_id> dengan ID dari docker ps)
sudo docker inspect <container_id> | grep -A 20 "NetworkSettings"
```

#### Opsi 4: Cek dari Dalam Container
```bash
# Masuk ke container API
sudo docker exec -it $(sudo docker ps -q -f name=portfolio-api) sh

# Dari dalam container, test
python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"
```

Kalau dari dalam container bisa, berarti app jalan tapi port tidak di-expose ke host.

---

## 🔴 MASALAH: Port Conflict Dokploy (3000) vs Web App (3000)

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

## 🔴 MASALAH: Web App REPLICAS 0/1 (Container Restart Terus)

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

## 🔴 MASALAH: CORS Error (API tidak bisa diakses dari Web)

### ❌ Gejala
Browser console menunjukkan CORS error saat web app fetch ke API.

### ✅ Fix
Pastikan environment variable `CORS_ORIGINS` di Dokploy app `portfolio-api` mencakup domain web:
```
CORS_ORIGINS=https://portfolio.yourdomain.com,https://www.portfolio.yourdomain.com
```

---

## 1. Arsitektur Network yang Benar

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

## 2. Quick Fix Commands

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

### Cek network
```bash
sudo docker network ls
sudo docker network inspect dokploy-network
```

---

## 3. Environment Variables Wajib di Dokploy

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

## 4. Checklist Deploy Berhasil

- [ ] Dokploy panel bisa diakses di `http://157.10.161.40:3000`
- [ ] GitHub App terinstall dan repository terhubung
- [ ] App `portfolio-api` dan `portfolio-web` terbuat
- [ ] Domain ditambahkan untuk masing-masing app (atau port mapping di-expose)
- [ ] Environment variables diisi
- [ ] Build berhasil (cek logs)
- [ ] API bisa diakses (via domain atau port mapping)
- [ ] Web bisa diakses (via domain atau port mapping)
- [ ] Web bisa hit API (cek browser network tab)

---

## 5. Dokploy-specific Notes

### Port Mapping di Dokploy
Dokploy menggunakan Docker Swarm, bukan docker-compose. Port mapping berbeda:

```bash
# Docker Swarm service port publish
sudo docker service update --publish-add published=8000,target=8000 portfolio-api-ez2jum
```

Atau lebih mudah via panel Dokploy:
1. Buka app
2. Tab **Advanced**
3. Cari **Ports** atau **Expose**
4. Tambahkan port yang mau di-publish

### Internal Communication
Kalau web dan API di Docker Swarm yang sama, mereka bisa komunikasi via service name:
```
http://portfolio-api-ez2jum:8000  # internal
```
Tapi untuk SSR fetch dari web container, gunakan domain publik atau internal service name.
