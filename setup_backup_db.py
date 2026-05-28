import os
import psycopg2

DDL = """
CREATE TABLE IF NOT EXISTS system_backups (
    backup_id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    storage_path TEXT
);

CREATE TABLE IF NOT EXISTS table_snapshots (
    snapshot_id SERIAL PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    backup_id INT REFERENCES system_backups(backup_id),
    record_count INT,
    snapshot_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction_logs (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    record_id VARCHAR(255),
    old_data JSONB,
    new_data JSONB,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255)
);
"""

def setup():
    try:
        conn = psycopg2.connect(
            host="pg-evangelista-prod.postgres.database.azure.com",
            database="postgres",
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(DDL)
        print("Backup/Log infrastructure created successfully.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup()
