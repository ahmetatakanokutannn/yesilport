CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  company_type VARCHAR(50),
  transport_types TEXT[],
  role VARCHAR(20) DEFAULT 'ROLE_USER',
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(10),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  subscription_status VARCHAR(20) DEFAULT 'FREE',
  subscription_expires TIMESTAMP,
  qa_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calculations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  legs JSONB NOT NULL,
  total_co2e_monthly DECIMAL(12,3),
  cbam_cost_eur DECIMAL(12,2),
  industry_benchmark DECIMAL(12,3),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenarios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  calculation_id INTEGER REFERENCES calculations(id) ON DELETE SET NULL,
  name VARCHAR(255),
  scenarios_data JSONB,
  comparison_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cbam_score INTEGER,
  csrd_score INTEGER,
  ylb_score INTEGER,
  total_score INTEGER,
  checklist_data JSONB,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50),
  question_text TEXT NOT NULL,
  attachment_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'PENDING',
  answer_text TEXT,
  answered_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  answered_at TIMESTAMP,
  rating INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mentor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'BOOKED',
  meeting_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  total_modules INTEGER,
  duration_hours DECIMAL(4,1),
  access_level VARCHAR(20) DEFAULT 'FREE',
  thumbnail_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255),
  video_url VARCHAR(500),
  transcript TEXT,
  order_index INTEGER,
  duration_minutes INTEGER
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  certificate_url VARCHAR(500),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  thumbnail_url VARCHAR(500),
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regulation_alerts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  severity VARCHAR(20) DEFAULT 'INFO',
  published_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS demo_requests (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  transport_type VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'NEW',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'READY',
  file_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
