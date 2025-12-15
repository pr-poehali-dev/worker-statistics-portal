import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления сотрудниками: получение списка, создание, обновление и удаление
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict с данными сотрудников
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT id, name, department, status, links, reports, warnings, salary 
                FROM t_p56655461_worker_statistics_po.employees 
                ORDER BY id
            ''')
            rows = cur.fetchall()
            employees = [
                {
                    'id': row[0],
                    'name': row[1],
                    'department': row[2],
                    'status': row[3],
                    'links': row[4],
                    'reports': row[5],
                    'warnings': row[6],
                    'salary': row[7]
                }
                for row in rows
            ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'employees': employees}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO t_p56655461_worker_statistics_po.employees 
                (name, department, status, links, reports, warnings, salary)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name, department, status, links, reports, warnings, salary
            ''', (
                body['name'],
                body['department'],
                body['status'],
                body.get('links', 0),
                body.get('reports', 0),
                body.get('warnings', 0),
                body['salary']
            ))
            
            row = cur.fetchone()
            conn.commit()
            
            employee = {
                'id': row[0],
                'name': row[1],
                'department': row[2],
                'status': row[3],
                'links': row[4],
                'reports': row[5],
                'warnings': row[6],
                'salary': row[7]
            }
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'employee': employee}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            employee_id = body.get('id')
            
            cur.execute('''
                UPDATE t_p56655461_worker_statistics_po.employees 
                SET name = %s, department = %s, status = %s, 
                    links = %s, reports = %s, warnings = %s, salary = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, department, status, links, reports, warnings, salary
            ''', (
                body['name'],
                body['department'],
                body['status'],
                body['links'],
                body['reports'],
                body['warnings'],
                body['salary'],
                employee_id
            ))
            
            row = cur.fetchone()
            conn.commit()
            
            if not row:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Сотрудник не найден'}),
                    'isBase64Encoded': False
                }
            
            employee = {
                'id': row[0],
                'name': row[1],
                'department': row[2],
                'status': row[3],
                'links': row[4],
                'reports': row[5],
                'warnings': row[6],
                'salary': row[7]
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'employee': employee}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            employee_id = params.get('id')
            
            if not employee_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID сотрудника обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'DELETE FROM t_p56655461_worker_statistics_po.employees WHERE id = %s',
                (employee_id,)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
