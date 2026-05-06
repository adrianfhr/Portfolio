# Dokploy Deployment Guide

> 🎯 **Objective:** Deploy the Interactive AI Engineering Portfolio to a VPS using Dokploy with GitHub-based CI/CD.

---

## 1. Prerequisites

| Requirement | Version / Notes |
|-------------|-----------------|
| VPS | Ubuntu 22.04+ dengan Docker & Docker Compose |
| Dokploy | Terinstall di VPS (lihat [dokploy.com](https://dokploy.com)) |
| Domain | Sudah diarahkan ke VPS |
| GitHub Repository | Repository ini sudah di-push ke GitHub |

---

## 2. Setup Dokploy di VPS

### 2.1 Install Dokploy

Jalankan di VPS:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Akses panel Dokploy di `http://<VPS_IP>:3000` dan lakukan setup awal.

### 2.2 Konfigurasi Server & Domain

1. Buka **Settings** → **Server**
2. Tambahkan domain utama (eg. `portfolio.yourdomain.com`)
3. Aktifkan **HTTPS** jika sudah siap

---

## 3. Connect GitHub ke Dokploy

### 3.1 Buat GitHub App

1. Di panel Dokploy, buka **Git**
2. Pilih **GitHub** sebagai source
3. Klik **Create Github App**
4. Isi nama (eg. `Dokploy-Github-App-<your-username>`) — pastikan unik
5. Klik **Create Github App**
6. Klik tombol **Install** yang muncul
7. Pilih repository yang ingin di-deploy
8. Klik **Install & Authorize**

> 💡 **Note:** Setelah ini, Dokploy bisa mengakses repository Anda untuk automatic deployments.

---

## 4. Buat Applications di Dokploy

Buat **2 aplikasi terpisah** untuk arsitektur ini:

### 4.1 API Application

| Field | Value |
|-------|-------|
| Name | `portfolio-api` |
| Source | GitHub |
| Repository | `your-username/interactive-ai-portfolio` |
| Branch | `main` |
| Build Type | `Dockerfile` |
| Dockerfile Path | `apps/api/Dockerfile` |
| Publish Directory | `.` |

**Environment Variables** (tambahkan di tab **Environment**):

```
APP_NAME=Interactive AI Engineering Portfolio API
APP_ENV=production
CORS_ORIGINS=https://portfolio.yourdomain.com
# Tambahkan variabel lain sesuai kebutuhan (DB, Redis, API keys, dll.)
```

### 4.2 Web Application

| Field | Value |
|-------|-------|
| Name | `portfolio-web` |
| Source | GitHub |
| Repository | `your-username/interactive-ai-portfolio` |
| Branch | `main` |
| Build Type | `Dockerfile` |
| Dockerfile Path | `apps/web/Dockerfile` |
| Publish Directory | `.` |

**Environment Variables**:

```
API_BASE_URL=https://api.portfolio.yourdomain.com
NEXT_PUBLIC_APP_NAME=Interactive AI Engineering Portfolio
NODE_ENV=production
```

---

## 5. Konfigurasi Domain & Reverse Proxy

### 5.1 Domain untuk API

1. Buka aplikasi `portfolio-api`
2. Tab **Domains**
3. Klik **Add Domain**
4. Isi: `api.portfolio.yourdomain.com`
5. Port: `8000`
6. Enable HTTPS

### 5.2 Domain untuk Web

1. Buka aplikasi `portfolio-web`
2. Tab **Domains**
3. Klik **Add Domain**
4. Isi: `portfolio.yourdomain.com`
5. Port: `3000`
6. Enable HTTPS

---

## 6. Webhook Deploy (GitHub Actions → Dokploy)

Agar CI/CD GitHub Actions bisa trigger redeploy otomatis setelah push image ke GHCR:

### 6.1 Dapatkan Webhook URL & Token

Di panel Dokploy, untuk masing-masing aplikasi:
1. Buka aplikasi → tab **Advanced**
2. Cari bagian **Webhooks**
3. Copy **Webhook URL** dan **Webhook Token**

### 6.2 Tambahkan Secrets di GitHub Repository

Buka repository GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret Name | Value |
|-------------|-------|
| `DOKPLOY_API_WEBHOOK_URL` | Webhook URL aplikasi API |
| `DOKPLOY_API_WEBHOOK_TOKEN` | Webhook Token aplikasi API |
| `DOKPLOY_WEB_WEBHOOK_URL` | Webhook URL aplikasi Web |
| `DOKPLOY_WEB_WEBHOOK_TOKEN` | Webhook Token aplikasi Web |

> 🔒 **Security:** Jangan pernah commit token ini ke repository. Gunakan GitHub Secrets.

### 6.3 Cara Kerja Webhook

Setiap kali push ke `main`:

1. GitHub Actions build & push image ke GHCR
2. Setelah image berhasil di-push, job `deploy-dokploy` dijalankan
3. Job tersebut mengirim POST request ke webhook Dokploy
4. Dokploy melakukan pull image terbaru dan redeploy aplikasi

---

## 7. Alur Deployment

```
Developer push ke main
        │
        ▼
┌─────────────────┐
│  GitHub Actions │
│  - Validate     │
│  - Build Image  │
│  - Push to GHCR │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Trigger        │
│  Dokploy        │
│  Webhook        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Dokploy VPS    │
│  - Pull Image   │
│  - Redeploy     │
└─────────────────┘
```

---

## 8. Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook 401 Unauthorized | Periksa kembali `DOKPLOY_*_WEBHOOK_TOKEN` di GitHub Secrets |
| Webhook 404 Not Found | Periksa kembali `DOKPLOY_*_WEBHOOK_URL` |
| Image tidak ter-pull | Pastikan GHCR image public, atau setup Docker login di Dokploy |
| Domain tidak resolve | Periksa DNS record, pastikan sudah mengarah ke VPS IP |
| Build gagal | Cek logs di tab **Logs** aplikasi di Dokploy panel |

---

## 9. Cross-References

- [System Architecture](../02-Architecture-Design/system-architecture.md)
- [Deployment Architecture](../02-Architecture-Design/deployment-architecture.md)
- [CI/CD Workflow](../../.github/workflows/ci.yml)
- [Dokploy Documentation](https://docs.dokploy.com)
