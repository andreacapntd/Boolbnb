@extends('layouts.main-layout')
{{-- @section('header')
  @include('partials.header1')
@endsection --}}
@section('content')

  <section id="section_home">

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 text-center">   
                   
          <div id="my_dashboard" class="">
            <div class="card-header"> {{ __('Ti sei Loggato Correttamente !') }}</div>
            
            <div class="card-body ">
              @if (session('status'))
              <div class="alert alert-success" role="alert">
                {{ session('status') }}
              </div>
              @endif
              
              <div> Benvenuto {{ $user-> firstname }}</div>
              </div>
          </div>
        </div>
    </div>
</div>
</section>
@endsection
