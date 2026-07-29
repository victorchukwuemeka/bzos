use crate::models::*;
use chrono::Utc;
use rusqlite::{params, Connection, Result};
use uuid::Uuid;

pub struct Database {
    conn: Connection,
}

impl Database {
    // ============================================================
    // INITIALIZATION
    // ============================================================

    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;

        conn.execute_batch("PRAGMA journal_mode=WAL;")?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;

        let db = Self { conn };
        db.run_migrations()?;
        db.seed_default_user()?;
        Ok(db)
    }

    fn run_migrations(&self) -> Result<()> {
        self.conn
            .execute_batch(include_str!("../migrations/001_create_tables.sql"))
    }

    fn seed_default_user(&self) -> Result<()> {
        self.conn.execute(
            "INSERT OR IGNORE INTO users (id, email, password_hash, full_name, created_at, updated_at)
             VALUES ('user-1', 'demo@victor.app', 'demo', 'Demo User', datetime('now'), datetime('now'))",
            [],
        )?;
        Ok(())
    }

    // ============================================================
    // USERS
    // ============================================================

    pub fn create_user(&self, user: &User) -> Result<()> {
        self.conn.execute(
            "INSERT INTO users (id, email, password_hash, full_name, business_name, phone, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                user.id,
                user.email,
                user.password_hash,
                user.full_name,
                user.business_name,
                user.phone,
                user.created_at,
                user.updated_at,
            ],
        )?;
        Ok(())
    }

    pub fn get_user_by_email(&self, email: &str) -> Result<Option<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, email, password_hash, full_name, business_name, phone, created_at, updated_at
             FROM users WHERE email = ?1"
        )?;

        let mut rows = stmt.query_map(params![email], |row| {
            Ok(User {
                id: row.get(0)?,
                email: row.get(1)?,
                password_hash: row.get(2)?,
                full_name: row.get(3)?,
                business_name: row.get(4)?,
                phone: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })?;

        match rows.next() {
            Some(row) => Ok(Some(row?)),
            None => Ok(None),
        }
    }

    pub fn get_user_by_id(&self, id: &str) -> Result<Option<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, email, password_hash, full_name, business_name, phone, created_at, updated_at
             FROM users WHERE id = ?1"
        )?;

        let mut rows = stmt.query_map(params![id], |row| {
            Ok(User {
                id: row.get(0)?,
                email: row.get(1)?,
                password_hash: row.get(2)?,
                full_name: row.get(3)?,
                business_name: row.get(4)?,
                phone: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })?;

        match rows.next() {
            Some(row) => Ok(Some(row?)),
            None => Ok(None),
        }
    }

    // ============================================================
    // CUSTOMERS
    // ============================================================

    pub fn create_customer(&self, customer: &Customer) -> Result<()> {
        self.conn.execute(
            "INSERT INTO customers (id, user_id, name, phone, email, notes, tags, budget_min, budget_max, source, created_at, updated_at, sync_status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
            params![
                customer.id,
                customer.user_id,
                customer.name,
                customer.phone,
                customer.email,
                customer.notes,
                customer.tags,
                customer.budget_min,
                customer.budget_max,
                customer.source,
                customer.created_at,
                customer.updated_at,
                customer.sync_status,
            ],
        )?;
        Ok(())
    }

    pub fn get_customers(&self, user_id: &str) -> Result<Vec<Customer>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, name, phone, email, notes, tags, budget_min, budget_max, source, created_at, updated_at, deleted_at, sync_status
             FROM customers WHERE user_id = ?1 AND deleted_at IS NULL ORDER BY created_at DESC"
        )?;

        let rows = stmt.query_map(params![user_id], |row| {
            Ok(Customer {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
                notes: row.get(5)?,
                tags: row.get(6)?,
                budget_min: row.get(7)?,
                budget_max: row.get(8)?,
                source: row.get(9)?,
                created_at: row.get(10)?,
                updated_at: row.get(11)?,
                deleted_at: row.get(12)?,
                sync_status: row.get(13)?,
            })
        })?;

        let mut customers = Vec::new();
        for row in rows {
            customers.push(row?);
        }
        Ok(customers)
    }

    pub fn get_customer_by_id(&self, id: &str) -> Result<Option<Customer>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, name, phone, email, notes, tags, budget_min, budget_max, source, created_at, updated_at, deleted_at, sync_status
             FROM customers WHERE id = ?1 AND deleted_at IS NULL"
        )?;

        let mut rows = stmt.query_map(params![id], |row| {
            Ok(Customer {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
                notes: row.get(5)?,
                tags: row.get(6)?,
                budget_min: row.get(7)?,
                budget_max: row.get(8)?,
                source: row.get(9)?,
                created_at: row.get(10)?,
                updated_at: row.get(11)?,
                deleted_at: row.get(12)?,
                sync_status: row.get(13)?,
            })
        })?;

        match rows.next() {
            Some(row) => Ok(Some(row?)),
            None => Ok(None),
        }
    }

    pub fn update_customer(&self, id: &str, customer: &Customer) -> Result<()> {
        self.conn.execute(
            "UPDATE customers SET name = ?1, phone = ?2, email = ?3, notes = ?4, tags = ?5, 
             budget_min = ?6, budget_max = ?7, source = ?8, updated_at = ?9, sync_status = 'pending'
             WHERE id = ?10",
            params![
                customer.name,
                customer.phone,
                customer.email,
                customer.notes,
                customer.tags,
                customer.budget_min,
                customer.budget_max,
                customer.source,
                Utc::now().to_rfc3339(),
                id,
            ],
        )?;
        Ok(())
    }

    pub fn delete_customer(&self, id: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE customers SET deleted_at = ?1, sync_status = 'pending' WHERE id = ?2",
            params![Utc::now().to_rfc3339(), id],
        )?;
        Ok(())
    }

    // ============================================================
    // DEALS
    // ============================================================

    pub fn create_deal(&self, deal: &Deal) -> Result<()> {
        self.conn.execute(
            "INSERT INTO deals (id, user_id, customer_id, title, value, currency, status, expected_close_date, notes, created_at, updated_at, sync_status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                deal.id,
                deal.user_id,
                deal.customer_id,
                deal.title,
                deal.value,
                deal.currency,
                deal.status,
                deal.expected_close_date,
                deal.notes,
                deal.created_at,
                deal.updated_at,
                deal.sync_status,
            ],
        )?;
        Ok(())
    }

    pub fn get_deals(&self, user_id: &str) -> Result<Vec<Deal>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, customer_id, title, value, currency, status, expected_close_date, notes, created_at, updated_at, deleted_at, sync_status
             FROM deals WHERE user_id = ?1 AND deleted_at IS NULL ORDER BY created_at DESC"
        )?;

        let rows = stmt.query_map(params![user_id], |row| {
            Ok(Deal {
                id: row.get(0)?,
                user_id: row.get(1)?,
                customer_id: row.get(2)?,
                title: row.get(3)?,
                value: row.get(4)?,
                currency: row.get(5)?,
                status: row.get(6)?,
                expected_close_date: row.get(7)?,
                notes: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
                deleted_at: row.get(11)?,
                sync_status: row.get(12)?,
            })
        })?;

        let mut deals = Vec::new();
        for row in rows {
            deals.push(row?);
        }
        Ok(deals)
    }

    pub fn get_deal_by_id(&self, id: &str) -> Result<Option<Deal>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, customer_id, title, value, currency, status, expected_close_date, notes, created_at, updated_at, deleted_at, sync_status
             FROM deals WHERE id = ?1 AND deleted_at IS NULL"
        )?;

        let mut rows = stmt.query_map(params![id], |row| {
            Ok(Deal {
                id: row.get(0)?,
                user_id: row.get(1)?,
                customer_id: row.get(2)?,
                title: row.get(3)?,
                value: row.get(4)?,
                currency: row.get(5)?,
                status: row.get(6)?,
                expected_close_date: row.get(7)?,
                notes: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
                deleted_at: row.get(11)?,
                sync_status: row.get(12)?,
            })
        })?;

        match rows.next() {
            Some(row) => Ok(Some(row?)),
            None => Ok(None),
        }
    }

    pub fn update_deal(&self, id: &str, deal: &Deal) -> Result<()> {
        self.conn.execute(
            "UPDATE deals SET customer_id = ?1, title = ?2, value = ?3, currency = ?4, status = ?5,
             expected_close_date = ?6, notes = ?7, updated_at = ?8, sync_status = 'pending'
             WHERE id = ?9",
            params![
                deal.customer_id,
                deal.title,
                deal.value,
                deal.currency,
                deal.status,
                deal.expected_close_date,
                deal.notes,
                Utc::now().to_rfc3339(),
                id,
            ],
        )?;
        Ok(())
    }

    pub fn delete_deal(&self, id: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE deals SET deleted_at = ?1, sync_status = 'pending' WHERE id = ?2",
            params![Utc::now().to_rfc3339(), id],
        )?;
        Ok(())
    }

    // ============================================================
    // FOLLOW-UPS
    // ============================================================

    pub fn create_follow_up(&self, follow_up: &FollowUp) -> Result<()> {
        self.conn.execute(
            "INSERT INTO follow_ups (id, user_id, customer_id, deal_id, type, scheduled_at, completed_at, notes, status, created_at, updated_at, sync_status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                follow_up.id,
                follow_up.user_id,
                follow_up.customer_id,
                follow_up.deal_id,
                follow_up.r#type,
                follow_up.scheduled_at,
                follow_up.completed_at,
                follow_up.notes,
                follow_up.status,
                follow_up.created_at,
                follow_up.updated_at,
                follow_up.sync_status,
            ],
        )?;
        Ok(())
    }

    pub fn get_follow_ups(&self, user_id: &str) -> Result<Vec<FollowUp>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, customer_id, deal_id, type, scheduled_at, completed_at, notes, status, created_at, updated_at, deleted_at, sync_status
             FROM follow_ups WHERE user_id = ?1 AND deleted_at IS NULL ORDER BY scheduled_at ASC"
        )?;

        let rows = stmt.query_map(params![user_id], |row| {
            Ok(FollowUp {
                id: row.get(0)?,
                user_id: row.get(1)?,
                customer_id: row.get(2)?,
                deal_id: row.get(3)?,
                r#type: row.get(4)?,
                scheduled_at: row.get(5)?,
                completed_at: row.get(6)?,
                notes: row.get(7)?,
                status: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
                deleted_at: row.get(11)?,
                sync_status: row.get(12)?,
            })
        })?;

        let mut follow_ups = Vec::new();
        for row in rows {
            follow_ups.push(row?);
        }
        Ok(follow_ups)
    }

    pub fn get_today_follow_ups(&self, user_id: &str) -> Result<Vec<FollowUp>> {
        let today = Utc::now().format("%Y-%m-%d").to_string();
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, customer_id, deal_id, type, scheduled_at, completed_at, notes, status, created_at, updated_at, deleted_at, sync_status
             FROM follow_ups WHERE user_id = ?1 AND deleted_at IS NULL AND scheduled_at LIKE ?2 AND status = 'pending' ORDER BY scheduled_at ASC"
        )?;

        let rows = stmt.query_map(params![user_id, format!("{}%", today)], |row| {
            Ok(FollowUp {
                id: row.get(0)?,
                user_id: row.get(1)?,
                customer_id: row.get(2)?,
                deal_id: row.get(3)?,
                r#type: row.get(4)?,
                scheduled_at: row.get(5)?,
                completed_at: row.get(6)?,
                notes: row.get(7)?,
                status: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
                deleted_at: row.get(11)?,
                sync_status: row.get(12)?,
            })
        })?;

        let mut follow_ups = Vec::new();
        for row in rows {
            follow_ups.push(row?);
        }
        Ok(follow_ups)
    }

    pub fn complete_follow_up(&self, id: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE follow_ups SET status = 'completed', completed_at = ?1, updated_at = ?2, sync_status = 'pending' WHERE id = ?3",
            params![Utc::now().to_rfc3339(), Utc::now().to_rfc3339(), id],
        )?;
        Ok(())
    }

    pub fn delete_follow_up(&self, id: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE follow_ups SET deleted_at = ?1, sync_status = 'pending' WHERE id = ?2",
            params![Utc::now().to_rfc3339(), id],
        )?;
        Ok(())
    }

    // ============================================================
    // TRANSACTIONS
    // ============================================================

    pub fn create_transaction(&self, transaction: &Transaction) -> Result<()> {
        self.conn.execute(
            "INSERT INTO transactions (id, user_id, customer_id, deal_id, type, amount, currency, description, category, payment_method, is_credit, due_date, paid_at, created_at, updated_at, sync_status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)",
            params![
                transaction.id,
                transaction.user_id,
                transaction.customer_id,
                transaction.deal_id,
                transaction.r#type,
                transaction.amount,
                transaction.currency,
                transaction.description,
                transaction.category,
                transaction.payment_method,
                transaction.is_credit,
                transaction.due_date,
                transaction.paid_at,
                transaction.created_at,
                transaction.updated_at,
                transaction.sync_status,
            ],
        )?;
        Ok(())
    }

    pub fn get_transactions(&self, user_id: &str) -> Result<Vec<Transaction>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, customer_id, deal_id, type, amount, currency, description, category, payment_method, is_credit, due_date, paid_at, created_at, updated_at, deleted_at, sync_status
             FROM transactions WHERE user_id = ?1 AND deleted_at IS NULL ORDER BY created_at DESC"
        )?;

        let rows = stmt.query_map(params![user_id], |row| {
            Ok(Transaction {
                id: row.get(0)?,
                user_id: row.get(1)?,
                customer_id: row.get(2)?,
                deal_id: row.get(3)?,
                r#type: row.get(4)?,
                amount: row.get(5)?,
                currency: row.get(6)?,
                description: row.get(7)?,
                category: row.get(8)?,
                payment_method: row.get(9)?,
                is_credit: row.get(10)?,
                due_date: row.get(11)?,
                paid_at: row.get(12)?,
                created_at: row.get(13)?,
                updated_at: row.get(14)?,
                deleted_at: row.get(15)?,
                sync_status: row.get(16)?,
            })
        })?;

        let mut transactions = Vec::new();
        for row in rows {
            transactions.push(row?);
        }
        Ok(transactions)
    }

    pub fn get_transactions_summary(&self, user_id: &str) -> Result<(f64, f64, f64)> {
        let mut stmt = self.conn.prepare(
            "SELECT 
                COALESCE(SUM(CASE WHEN type = 'sale' THEN amount ELSE 0 END), 0) as total_sales,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
                COALESCE(SUM(CASE WHEN type = 'sale' THEN amount ELSE 0 END), 0) - 
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as profit
             FROM transactions WHERE user_id = ?1 AND deleted_at IS NULL"
        )?;

        let summary = stmt.query_row(params![user_id], |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?))
        })?;

        Ok(summary)
    }

    pub fn delete_transaction(&self, id: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE transactions SET deleted_at = ?1, sync_status = 'pending' WHERE id = ?2",
            params![Utc::now().to_rfc3339(), id],
        )?;
        Ok(())
    }

    // ============================================================
    // SYNC QUEUE
    // ============================================================

    pub fn add_to_sync_queue(
        &self,
        user_id: &str,
        entity_type: &str,
        entity_id: &str,
        action: &str,
        payload: &str,
    ) -> Result<()> {
        self.conn.execute(
            "INSERT INTO sync_queue (id, user_id, entity_type, entity_id, action, payload, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                Uuid::new_v4().to_string(),
                user_id,
                entity_type,
                entity_id,
                action,
                payload,
                Utc::now().to_rfc3339(),
            ],
        )?;
        Ok(())
    }

    pub fn get_pending_sync_items(&self, user_id: &str) -> Result<Vec<SyncQueue>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, entity_type, entity_id, action, payload, created_at, synced_at
             FROM sync_queue WHERE user_id = ?1 AND synced_at IS NULL ORDER BY created_at ASC",
        )?;

        let rows = stmt.query_map(params![user_id], |row| {
            Ok(SyncQueue {
                id: row.get(0)?,
                user_id: row.get(1)?,
                entity_type: row.get(2)?,
                entity_id: row.get(3)?,
                action: row.get(4)?,
                payload: row.get(5)?,
                created_at: row.get(6)?,
                synced_at: row.get(7)?,
            })
        })?;

        let mut items = Vec::new();
        for row in rows {
            items.push(row?);
        }
        Ok(items)
    }

    pub fn mark_synced(&self, id: &str) -> Result<()> {
        self.conn.execute(
            "UPDATE sync_queue SET synced_at = ?1 WHERE id = ?2",
            params![Utc::now().to_rfc3339(), id],
        )?;
        Ok(())
    }
}
