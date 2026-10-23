import os  # 添加导入

# 配置数据库连接信息
class Config:
    # MySQL 配置参数
    HOSTNAME = "127.0.0.1"  # MySQL主机地址
    PORT = 3306  # MySQL端口


    USERNAME = "root"  # MySQL用户名

    # 云服务器数据库用户名
    # USERNAME = "cloudedge"  # MySQL用户名


    PASSWORD = "123456"  # MySQL密码

    # 云服务器数据库密码
    # PASSWORD = "cloudedge"  # MySQL密码

    DATABASE = "my_local_db"  # 使用test数据库进行测试

    # SQLAlchemy 连接字符串
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4"

    # 关闭 SQLAlchemy 的修改追踪
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 添加 SECRET_KEY 配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')  # 使用环境变量或默认值
