# SQLite Lantern

SQLite Lantern is an open-source SQLite browser and editor for PHP 8. Its clean web interface lets you browse tables, edit records, and run SQL against your `.sqlite` and `.db` files. It runs on your own server from a single PHP file.

[Try the live demo](https://playground.wordpress.net/?mode=seamless&storage=temp&can-save=no&page-title=SQLite%20Lantern&blueprint-url=https%3A%2F%2Fraw.githubusercontent.com%2Fuaimedna%2Fsqlite-lantern%2Fmaster%2Fdemo%2Fblueprint.json) with a sample database. Changes stay in your browser and reset when you reload.

![SQLite Lantern table browser showing records, compact row actions, and a highlighted SQL query](assets/screenshots/sqlite-table-browser.jpg)

## What you can do

- Browse, sort, and search rows in SQLite tables and views.
- Add, edit, and delete records.
- Create tables and views, edit columns, and manage indexes and triggers.
- Switch between database files, import and export SQL or CSV, and download a copy of a database file.

## How to install

Use PHP 8.3 with the `pdo_sqlite` or `sqlite3` extension enabled. Download [sqlite-lantern.php from the latest release](https://github.com/uaimedna/sqlite-lantern/releases/latest/download/sqlite-lantern.php) or build it from source.

```sh
git clone https://github.com/uaimedna/sqlite-lantern.git
cd sqlite-lantern
php build.php
```

Copy `sqlite-lantern.php` to a directory served by PHP. Create `phpliteadmin.config.php` next to it with your own password and the absolute path to the folder that contains your SQLite files.

```php
<?php
$password = 'replace-with-a-long-unique-password';
$directory = '/absolute/path/to/your/databases';
```

Keep your database folder outside the web root. Give PHP read access to the database files and their folder. For editing, give PHP write access to both as well. Open `sqlite-lantern.php` over HTTPS and sign in.

To try the install locally, run `php -S 127.0.0.1:8000` from the folder containing the installed files and open [SQLite Lantern on localhost](http://127.0.0.1:8000/sqlite-lantern.php).

## Credits and license

SQLite Lantern is based on [phpLiteAdmin](https://github.com/phpLiteAdmin/pla/tree/3fa9fedad19dc407a1786f97ba2b18a3c7b803bc). See the [original credits and copyright notices](docs/header.txt).

Licensed under the [GNU GPL v3 or later](LICENSE).
