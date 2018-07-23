describe('data', () => {
  let usersTest
  let progress
  
  it('debería exponer función computeUsersStats en objeto global', () => {
    assert.isFunction(computeUsersStats);
  });

  it('debería exponer función sortUsers en objeto global', () => {
    assert.isFunction(sortUsers);
  });

  it('debería exponer función filterUsers en objeto global', () => {
    assert.isFunction(filterUsers);
  });

  it('debería exponer función processCohortData en objeto global', () => {
    assert.isFunction(processCohortData);
  });

  describe('computeUsersStats(users, progress, courses)', () => {

    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    progress = fixtures.progress;
    const {users} = fixtures;

    it('debería retornar arreglo de usuarios con propiedad stats', () => {
      const processed = computeUsersStats(users, progress, courses);

      assert.equal(users.length, processed.length);

      processed.forEach(user => {
        assert.ok(user.hasOwnProperty('stats'));
        assert.isNumber(user.stats.percent);
        assert.isObject(user.stats.exercises);
        assert.isObject(user.stats.quizzes);
        assert.isObject(user.stats.reads);
      });
    });

    describe('user.stats para el primer usuario en data de prueba - ver carpeta data/', () => {

      const processed = computeUsersStats(users, progress, courses);

      it(
        'debería tener propiedad percent con valor 53',
        () => assert.equal(processed[0].stats.percent, 53)
      );

      it('debería tener propiedad exercises con valor {total: 2, completed: 0, percent: 0}', () => {
        assert.deepEqual(processed[0].stats.exercises, {
          total: 2,
          completed: 0,
          percent: 0,
        });
      });

      it('debería tener propiedad quizzes con valor {total: 3, completed: 2, percent: 67, scoreSum: 57, scoreAvg: 29}', () => {
        assert.deepEqual(processed[0].stats.quizzes, {
          total: 3,
          completed: 2,
          percent: 67,
          scoreSum: 57,
          scoreAvg: 29,
        });
      });

      it('debería tener propiedad reads con valor {total: 11, completed: 6, percent: 55}', () => {
        assert.deepEqual(processed[0].stats.reads, {
          total: 11,
          completed: 6,
          percent: 55,
        });
      });

    });

  });

  describe('sortUsers(users, orderBy, orderDirection)', () => {
    let user1 = {
      name : "Lorena Reyes",
      stats: {
        percent: 100,
        exercises : {
          total: 2,
          completed: 2,
          percent: 100
        },
        reads : {
          total: 5,
          completed: 5,
          percent: 5
        },
        quizzes : {
          total: 4,
          completed: 4,
          percent: 100,
          scoreSum: 200,
          scoreAvg: 50
        }
      }
    }

    let user2 = {
      name : "Danelly Sotomayor",
      stats: {
        percent: 53,
        exercises : {
          total: 2,
          completed: 1,
          percent: 50
        },
        reads : {
          total: 15,
          completed: 10,
          percent: 7
        },
        quizzes : {
          total: 6,
          completed: 6,
          percent: 100,
          scoreSum: 600,
          scoreAvg: 100
        }
      }
    }

    let user3 = {
      name : "Heydy Carrasco",
      stats: {
        percent: 58,
        exercises : {
          total: 5,
          completed: 3,
          percent: 60
        },
        reads : {
          total: 8,
          completed: 2,
          percent: 20
        },
        quizzes : {
          total: 10,
          completed: 9,
          percent: 90,
          scoreSum: 540,
          scoreAvg: 60
        }
      }
    }

    usersTest = [user1, user2, user3]

    it('debería retornar arreglo de usuarios ordenado por nombre ASC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "name", "asc"), [user2, user3, user1])
    });
    it('debería retornar arreglo de usuarios ordenado por nombre DESC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "name", "desc"), [user1, user3, user2])
    });
    it('debería retornar arreglo de usuarios ordenado por porcentaje general ASC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "completed", "asc"), [user2, user3, user1])
    });
    it('debería retornar arreglo de usuarios ordenado por porcentaje general DESC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "completed", "desc"), [user1, user3, user2])
    });
    it('debería retornar arreglo de usuarios ordenado por ejercicios completados ASC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "exercises", "asc"), [user2, user1, user3])
    });
    it('debería retornar arreglo de usuarios ordenado por ejercicios completados DESC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "exercises", "desc"), [user3, user1, user2])
    });
    it('debería retornar arreglo de usuarios ordenado por quizzes completados ASC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "quizzes", "asc"), [user1, user2, user3])
    });
    it('debería retornar arreglo de usuarios ordenado por quizzes completados DESC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "quizzes", "desc"), [user3, user2, user1])
    });
    it('debería retornar arreglo de usuarios ordenado por score promedio en quizzes completados ASC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "quizzesAvg", "asc"), [user1, user3, user2])
    });
    it('debería retornar arreglo de usuarios ordenado por score promedio en quizzes completados DESC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "quizzesAvg", "desc"), [user2, user3, user1])
    });
    it('debería retornar arreglo de usuarios ordenado por lecturas (reads) completadas ASC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "reads", "asc"), [user3, user1, user2])
    });
    it('debería retornar arreglo de usuarios ordenado por lecturas (reads) completadas DESC', () => {
      assert.deepEqual(window.sortUsers(usersTest, "reads", "desc"), [user2, user1, user3])
    });

  });

  describe('filterUsers(users, filterBy)', () => {
    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    const { users, progress } = fixtures;
    const processed = computeUsersStats(users, progress, courses);

    it('debería retornar nuevo arreglo solo con usuarios con nombres que contengan string (case insensitive)', () => {
      assert.deepEqual(filterUsers(processed, 'TERESA')[0].name, 'Teresa Isabel castro castillo');
    });
  });

  // let options = {
  //   cohort: "lim-2018-03-pre-core-pw",
  //   cohortData : {
  //     users: usersTest,
  //     progress,
  //     coursesIndex : ["intro"]
  //   },
  //   orderBy:"name",
  //   orderDirection:"asc",
  //   search : "lorena"
  // }

  describe('processCohortData({ cohortData, orderBy, orderDirection, filterBy })', () => {
    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const { users, progress } = fixtures;

    let options = {
      cohort: "lim-2018-03-pre-core-pw",
      cohortData : {
        users,//array en bruto users
        progress,//objeto en bruto progress
        coursesIndex : ["intro"]
      },
      orderBy:"name",
      orderDirection:"asc",
      search : "LESLIEANDREA"
    }

    it('debería retornar arreglo de usuarios con propiedad stats y aplicar sort y filter', () => {
        assert.deepEqual(window.processCohortData(options),[{
          id:"YolxWuYdppdWodRrE99p2GGvXLR2",
          locale:"es-ES",
          name:"Leslieandrea",
          role:"student",
          signupCohort:"lim-2018-03-pre-core-pw",
          stats: {
            exercises : {
              total: 2,
              completed: 2,
              percent: 100
            },
            percent: 100,
            quizzes : {
              total: 3,
              completed: 3,
              percent: 100,
              scoreSum: 262,
              scoreAvg: 87
            },
            reads: {
              total: 11,
              completed: 11,
              percent: 100
            }, 
          },
          timezone:"America/Lima"
        }
          // stats: {
          //   name : "lorena",
          //   percent: 100,
          //   exercises : {
          //     total: 2,
          //     completed: 2,
          //     percent: 100
          //   },
          //   reads : {
          //     total: 11,
          //     completed: 11,
          //     percent: 100
          //   },
          //   quizzes : {
          //     total: 3,
          //     completed: 3,
          //     percent: 100,
          //     scoreSum: 264,
          //     scoreAvg: 88
          //   }
          // }
      ]);
  });
  
});
  
});

  
