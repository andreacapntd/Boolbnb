@extends('layouts.main-layout')

{{-- @section('header')
  @include('partials.header2')
@endsection --}}

@section('content')

<section id="section_user_apartment_list">



<div class="container">

    <div class="row justify-content-center">
      <div class="col-md-8 ">

        <h2 class="mt-4 mb-0 text-center bg-light pb-3 pt-3">Messaggi ricevuti</h2>
        <a href="{{ url()->previous() }}" class="previous-page text-secondary"><i class="fas fa-reply"></i> 
          <span class="d-none d-md-inline">Pagina Precedente</span>
        </a>

            @foreach ($messages as $message)

              <div class="card" data-card="{{$count=0}}">
              <div class="card-body">
                {{-- <div class="d-flex flex-row flex-wrap"> --}}

                    <div class="pl-3 col-12 p-2 d-flex flex-column ">

                        <div> 
                          <small class="d-inline-block text-muted mb-2">Data: {{ $message -> created_at }} </small>
                          <br>
                          <h5 class=""> Messaggio ricevuto:  </h5>
                          <p class="border-bottom border-dark">{{ $message -> message }}</p>                     
                         <h6 class="text-muted">Recapito: {{ $message -> email }} </h6>
                        </div>

                    </div>

                {{-- </div>  --}}
              </div>
            </div>

          @endforeach

        </div>
     </div>

  </div>

</section>

@endsection
