# attanDANCE Dance Club - Database Schema

Here is the Markdown schema based on the provided "attanDANCE dance club" Entity-Relationship Diagram. I have added logical attributes suitable for a club management and social platform, incorporating UUIDs for all primary keys and defining the necessary indexes.

### **Roles**
Stores the authorization levels within the club (e.g., Admin, Instructor, Member).

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the role. |
| `name` | VARCHAR(50) | Unique, Not Null | Name of the role (e.g., 'Instructor'). |
| `description` | TEXT | Nullable | Details regarding role permissions. |
| `created_at` | TIMESTAMP | Not Null | Timestamp of role creation. |

* **Indexes:**
    * `idx_roles_name` on `name`

---

### **User**
The core account for all individuals interacting with the application.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the user. |
| `role_id` | UUID | Foreign Key | References `Roles(id)`. |
| `email` | VARCHAR(255)| Unique, Not Null | User's email address for login. |
| `password_hash`| VARCHAR(255)| Not Null | Hashed password. |
| `full_name` | VARCHAR(100)| Not Null | User's real name. |
| `created_at` | TIMESTAMP | Not Null | Timestamp of account creation. |

* **Indexes:**
    * `idx_users_role_id` on `role_id`
    * `idx_users_email` on `email`

---

### **Artists Records**
Contains specific profiles and dance-related metrics for users who are active performers or dancers.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the record. |
| `user_id` | UUID | Foreign Key, Unique | References `User(id)`. |
| `stage_name` | VARCHAR(100)| Nullable | Artist's performance name. |
| `specialty` | VARCHAR(100)| Nullable | Primary dance style (e.g., Hip-Hop). |
| `join_date` | DATE | Not Null | Date the artist joined the club. |
| `created_at` | TIMESTAMP | Not Null | Record creation timestamp. |

* **Indexes:**
    * `idx_artists_records_user_id` on `user_id`

---

### **Attendance**
Tracks the presence of artists at classes, rehearsals, or events.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the record. |
| `artist_record_id`| UUID | Foreign Key | References `Artists Records(id)`. |
| `session_date` | TIMESTAMP | Not Null | Date and time of the session. |
| `status` | VARCHAR(20) | Not Null | e.g., 'Present', 'Absent', 'Late'. |
| `notes` | TEXT | Nullable | Optional instructor notes. |

* **Indexes:**
    * `idx_attendance_artist_record_id` on `artist_record_id`
    * `idx_attendance_session_date` on `session_date`

---

### **Injuries**
Logs physical incidents or medical leave for the artists.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the injury log. |
| `artist_record_id`| UUID | Foreign Key | References `Artists Records(id)`. |
| `incident_date` | DATE | Not Null | Date the injury occurred. |
| `severity` | VARCHAR(50) | Not Null | e.g., 'Minor', 'Severe'. |
| `description` | TEXT | Not Null | Details of the injury. |
| `status` | VARCHAR(50) | Not Null | e.g., 'Recovering', 'Cleared'. |

* **Indexes:**
    * `idx_injuries_artist_record_id` on `artist_record_id`
    * `idx_injuries_status` on `status`

---

### **Posts**
Content created by users to share news, videos, or updates within the club.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the post. |
| `user_id` | UUID | Foreign Key | References `User(id)`. |
| `title` | VARCHAR(255)| Not Null | Title of the post. |
| `body` | TEXT | Not Null | Main content of the post. |
| `created_at` | TIMESTAMP | Not Null | Timestamp of creation. |

* **Indexes:**
    * `idx_posts_user_id` on `user_id`
    * `idx_posts_created_at` on `created_at`

---

### **Comments**
Replies made by users on specific posts.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the comment. |
| `post_id` | UUID | Foreign Key | References `Posts(id)`. |
| `user_id` | UUID | Foreign Key | References `User(id)`. |
| `content` | TEXT | Not Null | Text of the comment. |
| `created_at` | TIMESTAMP | Not Null | Timestamp of comment creation. |

* **Indexes:**
    * `idx_comments_post_id` on `post_id`
    * `idx_comments_user_id` on `user_id`

---

### **Reaction**
Likes, loves, or other interactions made by users on posts.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the reaction. |
| `post_id` | UUID | Foreign Key | References `Posts(id)`. |
| `user_id` | UUID | Foreign Key | References `User(id)`. |
| `reaction_type`| VARCHAR(20) | Not Null | e.g., 'Like', 'Celebrate', 'Fire'. |
| `created_at` | TIMESTAMP | Not Null | Timestamp of the reaction. |

* **Indexes:**
    * `idx_reactions_post_id` on `post_id`
    * `idx_reactions_user_id` on `user_id`
    * `idx_reactions_unique_user_post` on `(user_id, post_id)` *(Composite index to prevent multiple duplicate reactions from the same user on a single post)*
