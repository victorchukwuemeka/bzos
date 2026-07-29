use chrono::Utc;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ============================================================
// USER
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub password_hash: String,
    pub full_name: String,
    pub business_name: Option<String>,
    pub phone: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub email: String,
    pub password: String,
    pub full_name: String,
    #[serde(default)]
    pub business_name: Option<String>,
    #[serde(default)]
    pub phone: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

// ============================================================
// CUSTOMER
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Customer {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub notes: Option<String>,
    pub tags: Option<String>, // JSON array as text
    pub budget_min: Option<f64>,
    pub budget_max: Option<f64>,
    pub source: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub sync_status: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCustomer {
    pub name: String,
    #[serde(default)]
    pub phone: Option<String>,
    #[serde(default)]
    pub email: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
    #[serde(default)]
    pub tags: Option<Vec<String>>,
    #[serde(default)]
    pub budget_min: Option<f64>,
    #[serde(default)]
    pub budget_max: Option<f64>,
    #[serde(default)]
    pub source: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCustomer {
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub phone: Option<String>,
    #[serde(default)]
    pub email: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
    #[serde(default)]
    pub tags: Option<Vec<String>>,
    #[serde(default)]
    pub budget_min: Option<f64>,
    #[serde(default)]
    pub budget_max: Option<f64>,
    #[serde(default)]
    pub source: Option<String>,
}

// ============================================================
// DEAL
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Deal {
    pub id: String,
    pub user_id: String,
    pub customer_id: Option<String>,
    pub title: String,
    pub value: Option<f64>,
    pub currency: String,
    pub status: String, // lead, contacted, negotiation, won, lost
    pub expected_close_date: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub sync_status: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateDeal {
    pub title: String,
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub value: Option<f64>,
    #[serde(default)]
    pub currency: Option<String>,
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default)]
    pub expected_close_date: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateDeal {
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub title: Option<String>,
    #[serde(default)]
    pub value: Option<f64>,
    #[serde(default)]
    pub currency: Option<String>,
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default)]
    pub expected_close_date: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
}

// ============================================================
// FOLLOW-UP
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FollowUp {
    pub id: String,
    pub user_id: String,
    pub customer_id: Option<String>,
    pub deal_id: Option<String>,
    pub r#type: Option<String>, // call, message, email, meeting
    pub scheduled_at: String,
    pub completed_at: Option<String>,
    pub notes: Option<String>,
    pub status: String, // pending, completed, overdue
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub sync_status: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateFollowUp {
    pub scheduled_at: String,
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub deal_id: Option<String>,
    #[serde(default)]
    pub r#type: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFollowUp {
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub deal_id: Option<String>,
    #[serde(default)]
    pub r#type: Option<String>,
    #[serde(default)]
    pub scheduled_at: Option<String>,
    #[serde(default)]
    pub completed_at: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
    #[serde(default)]
    pub status: Option<String>,
}

// ============================================================
// TRANSACTION
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub user_id: String,
    pub customer_id: Option<String>,
    pub deal_id: Option<String>,
    pub r#type: String, // sale, expense, payment
    pub amount: f64,
    pub currency: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub payment_method: Option<String>,
    pub is_credit: bool,
    pub due_date: Option<String>,
    pub paid_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    pub sync_status: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateTransaction {
    pub r#type: String,
    pub amount: f64,
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub deal_id: Option<String>,
    #[serde(default)]
    pub currency: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub category: Option<String>,
    #[serde(default)]
    pub payment_method: Option<String>,
    #[serde(default)]
    pub is_credit: Option<bool>,
    #[serde(default)]
    pub due_date: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTransaction {
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub deal_id: Option<String>,
    #[serde(default)]
    pub r#type: Option<String>,
    #[serde(default)]
    pub amount: Option<f64>,
    #[serde(default)]
    pub currency: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub category: Option<String>,
    #[serde(default)]
    pub payment_method: Option<String>,
    #[serde(default)]
    pub is_credit: Option<bool>,
    #[serde(default)]
    pub due_date: Option<String>,
    #[serde(default)]
    pub paid_at: Option<String>,
}

// ============================================================
// ACTIVITY
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Activity {
    pub id: String,
    pub user_id: String,
    pub entity_type: Option<String>,
    pub entity_id: Option<String>,
    pub action: Option<String>,
    pub changes: Option<String>, // JSON
    pub created_at: String,
}

// ============================================================
// SYNC QUEUE
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncQueue {
    pub id: String,
    pub user_id: String,
    pub entity_type: String,
    pub entity_id: String,
    pub action: String,
    pub payload: String, // JSON
    pub created_at: String,
    pub synced_at: Option<String>,
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

impl User {
    pub fn new(email: String, password_hash: String, full_name: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            email,
            password_hash,
            full_name,
            business_name: None,
            phone: None,
            created_at: Utc::now().to_rfc3339(),
            updated_at: Utc::now().to_rfc3339(),
        }
    }
}

impl Customer {
    pub fn new(user_id: String, name: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id,
            name,
            phone: None,
            email: None,
            notes: None,
            tags: None,
            budget_min: None,
            budget_max: None,
            source: None,
            created_at: Utc::now().to_rfc3339(),
            updated_at: Utc::now().to_rfc3339(),
            deleted_at: None,
            sync_status: "pending".to_string(),
        }
    }
}

impl Deal {
    pub fn new(user_id: String, title: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id,
            customer_id: None,
            title,
            value: None,
            currency: "NGN".to_string(),
            status: "lead".to_string(),
            expected_close_date: None,
            notes: None,
            created_at: Utc::now().to_rfc3339(),
            updated_at: Utc::now().to_rfc3339(),
            deleted_at: None,
            sync_status: "pending".to_string(),
        }
    }
}

impl FollowUp {
    pub fn new(user_id: String, scheduled_at: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id,
            customer_id: None,
            deal_id: None,
            r#type: None,
            scheduled_at,
            completed_at: None,
            notes: None,
            status: "pending".to_string(),
            created_at: Utc::now().to_rfc3339(),
            updated_at: Utc::now().to_rfc3339(),
            deleted_at: None,
            sync_status: "pending".to_string(),
        }
    }
}

impl Transaction {
    pub fn new(user_id: String, r#type: String, amount: f64) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id,
            customer_id: None,
            deal_id: None,
            r#type,
            amount,
            currency: "NGN".to_string(),
            description: None,
            category: None,
            payment_method: None,
            is_credit: false,
            due_date: None,
            paid_at: None,
            created_at: Utc::now().to_rfc3339(),
            updated_at: Utc::now().to_rfc3339(),
            deleted_at: None,
            sync_status: "pending".to_string(),
        }
    }
}
