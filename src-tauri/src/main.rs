mod database;
mod models;

use database::Database;
use models::*;
use std::sync::Mutex;

struct AppState {
    db: Mutex<Database>,
}

// ============================================================
// Tauri Commands
// ============================================================

#[tauri::command]
fn create_customer(
    state: tauri::State<'_, AppState>,
    customer: CreateCustomer,
    user_id: String,
) -> Result<Customer, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let new_customer = Customer {
        id: uuid::Uuid::new_v4().to_string(),
        user_id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        notes: customer.notes,
        tags: customer
            .tags
            .map(|t| serde_json::to_string(&t).unwrap_or_default()),
        budget_min: customer.budget_min,
        budget_max: customer.budget_max,
        source: customer.source,
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        deleted_at: None,
        sync_status: "pending".to_string(),
    };

    db.create_customer(&new_customer)
        .map_err(|e| e.to_string())?;
    Ok(new_customer)
}

#[tauri::command]
fn get_customers(
    state: tauri::State<'_, AppState>,
    user_id: String,
) -> Result<Vec<Customer>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_customers(&user_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer(state: tauri::State<'_, AppState>, id: String) -> Result<Option<Customer>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_customer_by_id(&id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_deal(
    state: tauri::State<'_, AppState>,
    deal: CreateDeal,
    user_id: String,
) -> Result<Deal, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let new_deal = Deal {
        id: uuid::Uuid::new_v4().to_string(),
        user_id,
        customer_id: deal.customer_id,
        title: deal.title,
        value: deal.value,
        currency: deal.currency.unwrap_or_else(|| "NGN".to_string()),
        status: deal.status.unwrap_or_else(|| "lead".to_string()),
        expected_close_date: deal.expected_close_date,
        notes: deal.notes,
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        deleted_at: None,
        sync_status: "pending".to_string(),
    };

    db.create_deal(&new_deal).map_err(|e| e.to_string())?;
    Ok(new_deal)
}

#[tauri::command]
fn get_deals(state: tauri::State<'_, AppState>, user_id: String) -> Result<Vec<Deal>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_deals(&user_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_follow_up(
    state: tauri::State<'_, AppState>,
    follow_up: CreateFollowUp,
    user_id: String,
) -> Result<FollowUp, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let new_follow_up = FollowUp {
        id: uuid::Uuid::new_v4().to_string(),
        user_id,
        customer_id: follow_up.customer_id,
        deal_id: follow_up.deal_id,
        r#type: follow_up.r#type,
        scheduled_at: follow_up.scheduled_at,
        completed_at: None,
        notes: follow_up.notes,
        status: "pending".to_string(),
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        deleted_at: None,
        sync_status: "pending".to_string(),
    };

    db.create_follow_up(&new_follow_up)
        .map_err(|e| e.to_string())?;
    Ok(new_follow_up)
}

#[tauri::command]
fn get_follow_ups(
    state: tauri::State<'_, AppState>,
    user_id: String,
) -> Result<Vec<FollowUp>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_follow_ups(&user_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_today_follow_ups(
    state: tauri::State<'_, AppState>,
    user_id: String,
) -> Result<Vec<FollowUp>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_today_follow_ups(&user_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn complete_follow_up(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.complete_follow_up(&id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_transaction(
    state: tauri::State<'_, AppState>,
    transaction: CreateTransaction,
    user_id: String,
) -> Result<Transaction, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let new_transaction = Transaction {
        id: uuid::Uuid::new_v4().to_string(),
        user_id,
        customer_id: transaction.customer_id,
        deal_id: transaction.deal_id,
        r#type: transaction.r#type,
        amount: transaction.amount,
        currency: transaction.currency.unwrap_or_else(|| "NGN".to_string()),
        description: transaction.description,
        category: transaction.category,
        payment_method: transaction.payment_method,
        is_credit: transaction.is_credit.unwrap_or(false),
        due_date: transaction.due_date,
        paid_at: None,
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        deleted_at: None,
        sync_status: "pending".to_string(),
    };

    db.create_transaction(&new_transaction)
        .map_err(|e| e.to_string())?;
    Ok(new_transaction)
}

#[tauri::command]
fn get_transactions(
    state: tauri::State<'_, AppState>,
    user_id: String,
) -> Result<Vec<Transaction>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_transactions(&user_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_transactions_summary(
    state: tauri::State<'_, AppState>,
    user_id: String,
) -> Result<(f64, f64, f64), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_transactions_summary(&user_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_dashboard_stats(
    state: tauri::State<'_, AppState>,
    user_id: String,
) -> Result<serde_json::Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let customers = db.get_customers(&user_id).map_err(|e| e.to_string())?;
    let deals = db.get_deals(&user_id).map_err(|e| e.to_string())?;
    let today_follow_ups = db
        .get_today_follow_ups(&user_id)
        .map_err(|e| e.to_string())?;
    let (total_sales, total_expenses, profit) = db
        .get_transactions_summary(&user_id)
        .map_err(|e| e.to_string())?;

    let active_deals: Vec<&Deal> = deals
        .iter()
        .filter(|d| d.status != "won" && d.status != "lost")
        .collect();
    let pipeline_value: f64 = active_deals.iter().filter_map(|d| d.value).sum();
    let total_owed: f64 = 0.0; // TODO: Calculate from transactions

    Ok(serde_json::json!({
        "total_customers": customers.len(),
        "active_deals": active_deals.len(),
        "pipeline_value": pipeline_value,
        "today_follow_ups": today_follow_ups.len(),
        "total_sales": total_sales,
        "total_expenses": total_expenses,
        "profit": profit,
        "total_owed": total_owed,
    }))
}

// ============================================================
// Main
// ============================================================

fn main() {
    let db_path = "victor.db";
    let db = Database::new(db_path).expect("Failed to initialize database");

    let state = AppState { db: Mutex::new(db) };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            create_customer,
            get_customers,
            get_customer,
            create_deal,
            get_deals,
            create_follow_up,
            get_follow_ups,
            get_today_follow_ups,
            complete_follow_up,
            create_transaction,
            get_transactions,
            get_transactions_summary,
            get_dashboard_stats,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
