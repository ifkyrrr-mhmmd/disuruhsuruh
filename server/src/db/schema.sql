-- Skema Database PostgreSQL Neon untuk UMKM disuruhsuruh (Samarinda)

-- Enums
DO $$ BEGIN
    CREATE TYPE service_category AS ENUM ('antar_barang', 'titip_beli', 'bersih_rumah', 'layanan_lainnya');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TYPE service_category ADD VALUE IF NOT EXISTS 'layanan_lainnya';

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PENDING_REVIEW', 
        'AWAITING_PAYMENT',
        'CONFIRMED',
        'EXPIRED', 
        'PAYMENT_CONFIRMED', 
        'MITRA_ASSIGNED', 
        'IN_PROGRESS', 
        'COMPLETED', 
        'CANCELLED_BY_USER', 
        'CANCELLED_BY_ADMIN', 
        'REFUND_REQUESTED', 
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'CONFIRMED';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'EXPIRED';

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('COD', 'QRIS_DIGITAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Tabel Katalog Layanan
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    category service_category NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL DEFAULT 8000.00,
    base_distance_km NUMERIC(5, 2) NOT NULL DEFAULT 2.00,
    per_km_rate NUMERIC(10, 2) NOT NULL DEFAULT 3000.00,
    hourly_rate NUMERIC(10, 2) DEFAULT 30000.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Pesanan (Orders Core)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nano_id VARCHAR(16) NOT NULL UNIQUE,
    service_type service_category NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Lokasi & Jarak
    pickup_address TEXT,
    dropoff_address TEXT NOT NULL,
    pickup_lat DOUBLE PRECISION,
    pickup_lng DOUBLE PRECISION,
    dropoff_lat DOUBLE PRECISION NOT NULL,
    dropoff_lng DOUBLE PRECISION NOT NULL,
    distance_km NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    
    -- Variabel Bebas & Rincian Barang/Kosan
    dynamic_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Kalkulasi & Penyesuaian Harga
    initial_estimated_price NUMERIC(10, 2) NOT NULL,
    final_price NUMERIC(10, 2) NOT NULL,
    price_override_reason TEXT,
    predicted_duration_minutes INT DEFAULT 20,
    
    -- Pembayaran
    payment_method payment_method_type NOT NULL DEFAULT 'COD',
    payment_status payment_status_type NOT NULL DEFAULT 'UNPAID',
    payment_expiry_at TIMESTAMP WITH TIME ZONE,
    payment_transaction_id VARCHAR(100),
    qris_qr_url TEXT,
    
    -- Status & Penugasan
    status order_status NOT NULL DEFAULT 'PENDING_REVIEW',
    assigned_mitra_name VARCHAR(100),
    assigned_mitra_phone VARCHAR(20),
    
    -- Bukti Pengerjaan
    proof_image_url TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_nano_id ON orders(nano_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 3. Tabel Log Inferensi AI
CREATE TABLE IF NOT EXISTS ai_inference_logs (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    model_name VARCHAR(50) NOT NULL,
    input_features JSONB NOT NULL,
    predicted_output NUMERIC(10, 2) NOT NULL,
    is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    latency_ms INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Pengembalian Dana (Refunds)
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    bank_name VARCHAR(50) NOT NULL,
    account_number TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    refund_amount NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL DEFAULT 'Barang kosong di toko',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    transfer_receipt_url TEXT,
    processed_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Tabel Daftar Hitam Nomor / IP (Anti-Spam)
CREATE TABLE IF NOT EXISTS blacklist_contacts (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE,
    ip_address VARCHAR(45),
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Satu pesanan hanya boleh memiliki satu pengajuan refund aktif/tercatat.
CREATE UNIQUE INDEX IF NOT EXISTS idx_refunds_order_unique ON refunds(order_id);

-- Encrypted refund account fields may exceed the old varchar limits.
ALTER TABLE refunds ALTER COLUMN account_number TYPE TEXT;
ALTER TABLE refunds ALTER COLUMN account_holder_name TYPE TEXT;
