import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Authenticate user and return their roles
    Args: event with httpMethod, body containing email and password
    Returns: User data with roles or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip()
    password = body_data.get('password', '').strip()
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email и пароль обязательны'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, email, full_name, password_hash, active_role FROM users WHERE email = %s",
        (email,)
    )
    user_row = cur.fetchone()
    
    if not user_row:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный email или пароль'}),
            'isBase64Encoded': False
        }
    
    user_id, user_email, full_name, password_hash, active_role = user_row
    
    if password != password_hash:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный email или пароль'}),
            'isBase64Encoded': False
        }
    
    cur.execute(
        "SELECT role FROM user_roles WHERE user_id = %s",
        (user_id,)
    )
    roles_rows = cur.fetchall()
    roles: List[str] = [row[0] for row in roles_rows]
    
    cur.close()
    conn.close()
    
    if not active_role and roles:
        active_role = roles[0]
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'user': {
                'email': user_email,
                'fullName': full_name,
                'roles': roles,
                'activeRole': active_role or (roles[0] if roles else 'patient')
            }
        }),
        'isBase64Encoded': False
    }
