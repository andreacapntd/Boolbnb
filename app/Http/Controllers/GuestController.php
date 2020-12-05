<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Http\Response;

use App\Apartment;
use App\Service;
use App\Statistic;
use App\Tracker;

class GuestController extends Controller
{

  public function welcome(Request $request){

      $now = Carbon::now()->addHours(1);
      $expiredTime = $now->copy()->endOfDay();
      $delta= $expiredTime-> diffInMinutes($now);

      $user_ip = \Request::getClientIp();


      if($request->hasCookie('thisUser') == false){
        Cookie::queue(Cookie::make('thisUser', json_encode([$user_ip, "ClickCookie"]), $delta));
      }

      $count=0;
      $aparts = Apartment::where('sponsorship', '=', true) -> get();

        return view('welcome',compact('aparts','count'));
  }

    public function show(Request $request , $id) {

      $now = Carbon::now()->addHours(1);
      $expiredTime = $now->copy()->endOfDay();
      $delta= $expiredTime-> diffInMinutes($now);


      $apart = Apartment::findOrFail($id);
      $user_ip = \Request::getClientIp();

      $services = $apart->services()->get();
      $stat = $apart->statistic()->get();
      $user = Auth::user();

      $today = Carbon::now()->addHours(1)->isoFormat('Y M D');
      $count = count($stat);
      $i=0;

        $cookieVal = json_decode($request->cookie('thisUser'),true);

        if(is_null($cookieVal)){

            $user_ip = \Request::getClientIp();

            Cookie::queue(Cookie::make('thisUser', json_encode([$user_ip, rand(0,50)]), $delta));

          }
            if (!in_array($apart->id,$cookieVal) ) {

              array_push($cookieVal,$apart->id);
              Cookie::queue(Cookie::make('thisUser', json_encode($cookieVal), $delta));


                  if ( is_null($user) ) {
                    foreach ($stat as $statistic) {
                      $currentdate = Carbon::parse($statistic['current_date'])->isoFormat('Y M D');

                          if ($currentdate == $today ) {
                            $statistic ->increment('number_of_click');
                          }
                          else {
                            $i ++;
                          }
                      }

                          if( $count == $i) {
                          $apart->statistic()->create();
                          }
                    }

                  else if( $user['id'] !== $apart['user_id'] ) {
                    foreach ($stat as $statistic) {
                      $currentdate = Carbon::parse($statistic['current_date'])->isoFormat('Y M D');

                        if ($currentdate == $today ) {
                          $statistic ->increment('number_of_click');
                        }
                        else{
                          $i ++;
                        }
                    }

                            if( $count == $i) {
                              $apart->statistic()->create();
                            }
                  }

            }
              else{
            }



            $cook = $request-> cookie('thisUser');
            $newcookie = new Tracker;
            $newcookie-> cookie_name = $cook;
            $newcookie -> minuti_mancanti = $delta;
            $newcookie->save();



    return view('show-guest-apartment', compact('apart','services','user'));
  }


  public function latlng(Request $request) {

    $lat = $request['lat'];
    $lng = $request['lng'];


    return view('search-results', compact('lat','lng'));
  }

    public function index() {

    $aparts = Apartment::all();

    foreach ($aparts as $apart) {
      $i = 1;
      $i++;
      $arrayImgs = [];
        $imgs = $apart -> images() -> get();

          if ($imgs !== null ) {

            $i = 0;
              foreach ($imgs as $img) {
                $arrayImgs[$i] = $img['image_path'];
                $i++;
              }
          }

          else {
            $arrayImgs[0] = ['no'];
          }
          $apart['imgs'] = $arrayImgs;


      $servs = $apart -> services() -> get();
      $arrayServ = [0];
      if ($servs !== null ) {

        $j = 1;
        foreach ($servs as $serv) {
          $arrayServ[$j] = $serv['id'];
          $j++;
        }


        $apart['services'] = $arrayServ;
      }
    }



    return response()->json($aparts);
  }



}
