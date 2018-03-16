<?php

function sendEmail() {
	$request = Slim::getInstance()->request();
    $emailPostData = json_decode($request->getBody());
	if (isset($emailPostData->email) && !empty($emailPostData->email) && 
		isset($emailPostData->nombre) && !empty($emailPostData->nombre) && 
		isset($emailPostData->mensaje) && !empty($emailPostData->mensaje)) 
		{
			$subject = "Mail from " . $emailPostData->email;
			$headers = "From:" . $emailPostData->email;
			$messageBody = "";
		    $messageBody .= "<p><b>Please do not respond to this email.</b></p>" . "\n";
	        $messageBody .= "<p>Contact this person at: " . $emailPostData->email . "</p>" . "\n";
	        $messageBody .= "<p>Message: " . $emailPostData->nombre . "</p>" . "\n";
	        $messageBody .= "<p>Message: " . $emailPostData->mensaje . "</p>" . "\n";
            $messageBody .= "<br>" . "\n";
	        $messageBody = strip_tags($messageBody);
			$captcha = new SimpleCaptcha();
			$isHuman = $captcha->Validate($captchaCode, $captchaId);
			try {
				if ( mail('alecellis1985@gmail.com',$subject,$messageBody,$headers)) {
					$response = MessageHandler::getSuccessResponse("The email has been sent!", null);
				} else {

					$response = MessageHandler::getErrorResponse("An error has ocurred, pleas try again later.");
				}
			} catch (Exception $e) {

				$response = MessageHandler::getErrorResponse("An error has ocurred, pleas try again later.");
			}
		}
		else{
			$response = MessageHandler::getErrorResponse("Error, please fill in email and message!");
		}
    

    echo $response;
}

function sendMailToContact() {

    $request = Slim::getInstance()->request();

    $emailPostData = json_decode($request->getBody());



    if (isset($emailPostData->email) && !empty($emailPostData->email) &&
            isset($emailPostData->mensaje) && !empty($emailPostData->mensaje)) {



        $para = $emailPostData->contactemail;

        $headers = "From: Do not Respond pineapple-lab.com<hello@pineapple-lab.com>";



        $subject = "Message from: " . $emailPostData->emial;

        $messageBody = "";

        $messageBody .= "<p><b>Please do not respond to thie email.</b></p>" . "\n";

        $messageBody .= "<p>Contact this person at: " . $emailPostData->email . "</p>" . "\n";

            $messageBody .= "<br>" . "\n";



        $messageBody .= "<p> Message: " . $emailPostData->mensaje . "</p>";



        $messageBody = strip_tags($messageBody);



        try {

            if (mail($para, $subject, $messageBody, $headers)) {

                updateEmailsReceived($para);

                $response = MessageHandler::getSuccessResponse("Email was sent!", null);
            } else {

                $response = MessageHandler::getErrorResponse("Ups! There was an error. Please try again later");
            }
        } catch (Exception $e) {

            $response = MessageHandler::getErrorResponse("Ups! There was an error. Please try again later");
        }
    } else {

        $response = MessageHandler::getErrorResponse("Please fill up all fields before sending the email");
    }

    echo $response;
}
