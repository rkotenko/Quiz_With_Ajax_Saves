#!/usr/bin/php

<?php
   // Small script that compiles all the handle templates into .template files
 
   $d = dir('templates');  // change to whatever directory suits you
   $dir = $d->path . '/';
   $files = '';

    while(false !== ($entry = $d->read()))
    {
        if(strpos($entry, '.handlebars') !== false)
        {    
            $name = explode('.', $entry);
            $files .= $dir . $name[0] . '.' . $name[1] . ' ';
        }
    }

    $command = 'handlebars ' . $files . ' -f ' . $dir . 'master_template.js';
    echo $command . "\n";
    exec($command);
?>
