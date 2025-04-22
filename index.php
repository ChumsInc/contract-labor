<?php
/**
 * @package Chums
 * @subpackage Routings
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2012, steve
 */

use chums\ui\WebUI2;
use chums\user\Groups;

require_once "autoload.inc.php";


$ui = new WebUI2([
    'title' => 'Contract Labor Entry',
    'requiredRoles' => [Groups::PRODUCTION],
    'bodyClassName' => 'container-fluid'
]);
$ui->addManifestJSON('public/js/manifest.json')->render();
