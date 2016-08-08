<?php

namespace Sublite\Onliner\CommonLib;

require_once '/../vendor/autoload.php';

class commonLibTest extends \PHPUnit_Framework_TestCase
{
  public function testIsUIDValid()
  {
    $this->assertTrue(isUIDValid(5));
    $this->assertFalse(isUIDValid("str"));
    $this->assertFalse(isUIDValid(null));
  }
}
