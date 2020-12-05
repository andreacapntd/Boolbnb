<?php

use Illuminate\Database\Seeder;
use App\Statistic;
use App\Apartment;
use App\Message;

class StatisticSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        factory(Statistic::class,2) -> create();

    }
}
