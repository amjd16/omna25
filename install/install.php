<?php
/**
 * ملف تثبيت نظام إدارة الأمناء
 * وزارة العدل وحقوق الإنسان اليمنية
 */

// التحقق من متطلبات النظام
function checkSystemRequirements() {
    $requirements = [
        'PHP Version' => version_compare(PHP_VERSION, '8.1.0', '>='),
        'MySQL Extension' => extension_loaded('mysql') || extension_loaded('mysqli') || extension_loaded('pdo_mysql'),
        'OpenSSL Extension' => extension_loaded('openssl'),
        'PDO Extension' => extension_loaded('pdo'),
        'Mbstring Extension' => extension_loaded('mbstring'),
        'Tokenizer Extension' => extension_loaded('tokenizer'),
        'XML Extension' => extension_loaded('xml'),
        'Ctype Extension' => extension_loaded('ctype'),
        'JSON Extension' => extension_loaded('json'),
        'BCMath Extension' => extension_loaded('bcmath'),
    ];
    
    return $requirements;
}

// إعداد قاعدة البيانات
function setupDatabase($host, $username, $password, $database) {
    try {
        $pdo = new PDO("mysql:host=$host", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // إنشاء قاعدة البيانات إذا لم تكن موجودة
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

// إنشاء ملف .env
function createEnvFile($appName, $appUrl, $dbHost, $dbDatabase, $dbUsername, $dbPassword) {
    $envContent = "APP_NAME=\"$appName\"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=$appUrl

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=$dbHost
DB_PORT=3306
DB_DATABASE=$dbDatabase
DB_USERNAME=$dbUsername
DB_PASSWORD=$dbPassword

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=\"noreply@notary-system.gov.ye\"
MAIL_FROM_NAME=\"\${APP_NAME}\"
";

    return file_put_contents('../backend/.env', $envContent);
}

// معالجة النموذج
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appName = $_POST['app_name'] ?? 'نظام إدارة الأمناء';
    $appUrl = $_POST['app_url'] ?? 'http://localhost';
    $dbHost = $_POST['db_host'] ?? 'localhost';
    $dbDatabase = $_POST['db_database'] ?? 'notary_management_db';
    $dbUsername = $_POST['db_username'] ?? 'notary_user';
    $dbPassword = $_POST['db_password'] ?? '';
    
    $errors = [];
    $success = [];
    
    // التحقق من متطلبات النظام
    $requirements = checkSystemRequirements();
    $allRequirementsMet = true;
    foreach ($requirements as $requirement => $met) {
        if (!$met) {
            $allRequirementsMet = false;
            $errors[] = "متطلب مفقود: $requirement";
        }
    }
    
    if ($allRequirementsMet) {
        // إعداد قاعدة البيانات
        if (setupDatabase($dbHost, $dbUsername, $dbPassword, $dbDatabase)) {
            $success[] = "تم إعداد قاعدة البيانات بنجاح";
            
            // إنشاء ملف .env
            if (createEnvFile($appName, $appUrl, $dbHost, $dbDatabase, $dbUsername, $dbPassword)) {
                $success[] = "تم إنشاء ملف الإعدادات بنجاح";
                
                // تشغيل أوامر Laravel
                $commands = [
                    'cd ../backend && php artisan key:generate --force',
                    'cd ../backend && php artisan migrate --force',
                    'cd ../backend && php artisan db:seed --force'
                ];
                
                foreach ($commands as $command) {
                    exec($command, $output, $returnCode);
                    if ($returnCode === 0) {
                        $success[] = "تم تنفيذ: $command";
                    } else {
                        $errors[] = "فشل في تنفيذ: $command";
                    }
                }
                
                if (empty($errors)) {
                    $success[] = "تم تثبيت النظام بنجاح! يمكنك الآن الوصول إلى النظام.";
                }
            } else {
                $errors[] = "فشل في إنشاء ملف الإعدادات";
            }
        } else {
            $errors[] = "فشل في الاتصال بقاعدة البيانات";
        }
    }
}

$requirements = checkSystemRequirements();
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تثبيت نظام إدارة الأمناء</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        
        .header p {
            color: #666;
            font-size: 16px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .requirements {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .requirement {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .requirement:last-child {
            border-bottom: none;
        }
        
        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status.success {
            background: #d4edda;
            color: #155724;
        }
        
        .status.error {
            background: #f8d7da;
            color: #721c24;
        }
        
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .alert.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>تثبيت نظام إدارة الأمناء</h1>
            <p>وزارة العدل وحقوق الإنسان اليمنية</p>
        </div>
        
        <?php if (isset($errors) && !empty($errors)): ?>
            <div class="alert error">
                <strong>أخطاء:</strong>
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <?php if (isset($success) && !empty($success)): ?>
            <div class="alert success">
                <strong>نجح:</strong>
                <ul>
                    <?php foreach ($success as $message): ?>
                        <li><?php echo htmlspecialchars($message); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <div class="requirements">
            <h3 style="margin-bottom: 15px; color: #333;">متطلبات النظام</h3>
            <?php foreach ($requirements as $requirement => $met): ?>
                <div class="requirement">
                    <span><?php echo $requirement; ?></span>
                    <span class="status <?php echo $met ? 'success' : 'error'; ?>">
                        <?php echo $met ? 'متوفر' : 'مفقود'; ?>
                    </span>
                </div>
            <?php endforeach; ?>
        </div>
        
        <form method="POST">
            <div class="form-group">
                <label for="app_name">اسم التطبيق</label>
                <input type="text" id="app_name" name="app_name" value="نظام إدارة الأمناء" required>
            </div>
            
            <div class="form-group">
                <label for="app_url">رابط التطبيق</label>
                <input type="url" id="app_url" name="app_url" value="http://localhost" required>
            </div>
            
            <div class="form-group">
                <label for="db_host">خادم قاعدة البيانات</label>
                <input type="text" id="db_host" name="db_host" value="localhost" required>
            </div>
            
            <div class="form-group">
                <label for="db_database">اسم قاعدة البيانات</label>
                <input type="text" id="db_database" name="db_database" value="notary_management_db" required>
            </div>
            
            <div class="form-group">
                <label for="db_username">اسم المستخدم</label>
                <input type="text" id="db_username" name="db_username" value="notary_user" required>
            </div>
            
            <div class="form-group">
                <label for="db_password">كلمة المرور</label>
                <input type="password" id="db_password" name="db_password" required>
            </div>
            
            <button type="submit" class="btn">تثبيت النظام</button>
        </form>
    </div>
</body>
</html>

