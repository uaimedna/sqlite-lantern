<?php

if (!isset($demoWebRoot, $demoDataDirectory)) {
    return;
}

chdir(dirname(__DIR__));
ob_start();
require 'build.php';
ob_end_clean();

mkdir($demoDataDirectory);
$demoDatabase = new PDO('sqlite:' . $demoDataDirectory . '/studio.sqlite');
$demoDatabase->exec(file_get_contents(__DIR__ . '/studio.sql'));
$demoDatabase = null;

$demoConfig = "<?php\n"
    . "\$password = '';\n"
    . '$directory = ' . var_export($demoDataDirectory, true) . ";\n";

if (file_put_contents($demoWebRoot . '/phpliteadmin.config.php', $demoConfig) === false
    || !copy('sqlite-lantern.php', $demoWebRoot . '/sqlite-lantern.php')) {
    throw new RuntimeException('Could not install the SQLite Lantern demo.');
}
