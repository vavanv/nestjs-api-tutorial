import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vladimir.vv@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('Should Throw if email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...dto,
            email: 'vladimir.vv',
          })
          .expectStatus(400);
      });
      it('Should Throw if password is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...dto,
            password: '',
          })
          .expectStatus(400);
      });
      it('Should Throw if credentials are not provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('Should Signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should Throw if email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            ...dto,
            email: 'vladimir.vv',
          })
          .expectStatus(400);
      });
      it('Should Throw if password is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            ...dto,
            password: '',
          })
          .expectStatus(400);
      });
      it('Should Throw if credentials are not provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('Should Signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('access_token', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get Me', () => {
      it('Should Get Me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{access_token}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it.todo('Should Edit User');
    });
  });
  describe('Bookmark', () => {
    describe('Create Bookmark', () => {
      it.todo('Should Create Bookmark');
    });
    describe('Get Bookmarks', () => {
      it.todo('Should Get Bookmarks');
    });
    describe('Get Bookmark By Id', () => {
      it.todo('Should Get Bookmark By Id');
    });
    describe('Edit Bookmark By Id', () => {
      it.todo('Should Edit Bookmark By Id');
    });
    describe('Delete Bookmark By Id', () => {
      it.todo('Should Delete Bookmark By Id');
    });
  });
});
