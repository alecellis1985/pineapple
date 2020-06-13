<?php

 //Replace this with your own email address
$siteOwnersEmail = 'alecellis1985@gmail.com';
$postData = json_decode($_POST['contactData']);
// echo json_decode($postData['email']);
// var_dump(json_decode($postData));
// $ppp = $postData->email;
// print_r($ppp);
// die();
if($_POST) {
   $email= $postData->email;
   $nombre = $postData->nombre;
   $mensaje = $postData->mensaje;
   
   if (!isset($mensaje) || empty($mensaje)) {
		$error['mensaje'] = "Please enter a message.";
	}
   
	if (empty($nombre) || strlen($nombre) < 2) {
		$error['nombre'] = "Please enter name.";
	}

	if (!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is', $email)) {
		$error['email'] = "Email is not valid.";
	}

	$subject = $nombre . " quiere software!";

	$messageBody = "";
	$messageBody .= "<p><b>Please do not respond to this email.</b></p>";
	$messageBody .= "<p><b>Contact this person at:</b> " . $email . "</p>";
	$messageBody .= "<p><b>Nombre:</b> " . $nombre . "</p>";
	$messageBody .= "<p><b>Mensaje:</b> " . $mensaje . "</p>";
	
	$messageBody .= "<br>" . "\n";
	$messageBody = strip_tags($messageBody,'<p><br><b>');

   // Set From: header
   $from =  $nombre . " <" . $email . ">";

   // Email Headers
	$headers = "From: " . $from . "\r\n";
	$headers .= "Reply-To: ". $email . "\r\n";
 	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	
	try{
		if (!$error) {
			ini_set("sendmail_from", $siteOwnersEmail); // for windows server
			$mail = mail($siteOwnersEmail, $subject, $messageBody, $headers);

			if ($mail) { 
				echo "OK"; 
			}
			else { 
				echo "Something went wrong. Please try again."; 
			}
		} # end if - no validation error
		else {
			//$response = "Por favor llene todos los valores necesarios.";
			$response = (isset($error['nombre'])) ? $error['nombre'] . "<br /> \n" : null;
			$response .= (isset($error['email'])) ? $error['email'] . "<br /> \n" : null;
			$response .= (isset($error['mensaje'])) ? $error['mensaje'] . "<br />" : null;
			echo $response;
		}
	}catch(Exception $err){
		print_r($err);
	}
}