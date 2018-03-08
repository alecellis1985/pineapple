<?php

require 'Slim/Slim.php';

require_once("Slim/includes/class.Conexion.BD.php");
require_once("Slim/config/parametros.php");
require_once("Slim/includes/MessageHandler.php");

require_once('mailHandler.php');session_cache_limiter(false);
session_start();
$app = new Slim();



$app->post('/sendMail', 'sendEmail');

$app->run();