<?php

namespace Sublite\Onliner;

require_once '/../vendor/autoload.php';

class usersTest extends \PHPUnit_Framework_TestCase
{
  private $user;

  protected function setUp()
  {
    $this->user = new Users(1);
  }

  public function testAdd()
  {
    $this->assertTrue($this->user->add(1));
  }

  public function testRemove()
  {
    $this->assertTrue($this->user->remove(1));
  }

  public function testgetAllUsersStats()
  {
    $this->assertEquals(array(), $this->user->getAllUsersStats(0));
  }
}
