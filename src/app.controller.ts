import { Body, Controller, Get, Param, Post, Query, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import db from './db';
import { PaintingDto } from './painting.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('list')
  async listPaintings(@Query('year') year = 1990) {
    const [ rows ] = await db.execute(
      'SELECT id, title FROM paintings WHERE year > ?',
      [ year ]
      );



    return {
      paintings: rows,
    };
  }

  @Get('paintings/new')
    @Render('form')
    newPaintingForm() {
      return {};
    }

  @Post('paintings/new')
  @Redirect('show')
  async newPainting(@Body() painting: PaintingDto){
    painting.on_display = painting.on_display == 1;
    const [result]: any = await db.execute(
      'INSERT INTO paintings (title, year, on_display) VALUES (?, ?, ?)',
      [ painting.title, painting.year, painting.on_display ]
    );
    return {
      url: '/paintings/' + result.insertId,
    };
  }

  @Get('paintings/:id')
  @Render('show')
  async showPainting(@Param('id') id: number){
    const [ rows ] = await db.execute(
      'SELECT title, year, on_display FROM paintings WHERE id = ?',
      [ id ]
    );
    return { painting: rows[0] };
  }

  
  @Render('list')
  deletePaintingForm() {
    return {};
  }

  @Post('paintings')
  async deletePainting(){
    const [result]: any = await db.execute('DELETE ? FROM paintings WHERE id = ?',
      [  ]
    );
    return {};
  }

}
