@extends('layouts.main-layout')
@section('content')



  <section id="section">
    <a href="{{ url()->previous() }}" class="previous-page text-secondary"><i class="fas fa-reply"></i> 
      <span class="d-none d-md-inline">Pagina Precedente</span>
    </a>
    
    <div class="container">
      <div class="col-6 mb-5 mt-5">


    <div id="views-chart" class="chart" style="margin-top: 150px; background-color: white;position: relative; height:60vh; width:80vw">

                <canvas id="myChart" > </canvas>

        <div id="chart-prev" ><i class="fas fa-chevron-circle-left"></i> </div>
        <div id="chart-next" ><i class="fas fa-chevron-circle-right"></i> </div>

    </div>

    <div id="message-chart" class="chart" style="background-color: white; position: relative; height:40vh; width:80vw">

                  <canvas id="mymessageChart" ></canvas>

    </div>


  </div>

  </div>

  </section>

  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>

  <script src="{{asset('js/mychart.js')}}" charset="utf-8"></script>


@endsection
