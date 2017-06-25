/* eslint-env node, mocha */

import chai from 'chai'
import dirtyChai from 'dirty-chai'

import { List } from 'immutable'
import SquareMatrix from '../src/SquareMatrix'
import Determinant from '../src/Determinant'

chai.use(dirtyChai)
const { expect } = chai

describe('SquareMatrix', function () {
  const That = SquareMatrix

  describe('constructor', function () {
    it('에러 던짐: 2차원 배열이 아닌 경우', function () {
      const error = '2차원 리스트가 아닙니다'

      expect(() => new That()).to.throw(error)
      expect(() => new That('1')).to.throw(error)
      expect(() => new That(123)).to.throw(error)
      expect(() => new That([1, 2, 3])).to.throw(error)
      expect(() => new That([[3], [6, 9], 12])).to.throw(error)
    })

    it('에러 던짐: 정사각형 배열이 아닌 경우', function () {
      const error = '정사각형 리스트가 아닙니다'

      expect(() => new That([[1, 2], [3, 4, 5]])).to.throw(error)
      expect(() => new That([[1, 2], [3, 4], [5, 6]])).to.throw(error)
      expect(() => new That([[1, 2, 3], [4, 5, 6], [7, 8]])).to.throw(error)
    })

    it('에러 던짐: 배열에 정수가 아닌 값이 포함된 경우', function () {
      const error = '2차원 정수 리스트가 아닙니다'

      expect(() => new That([[undefined]])).to.throw(error)
      expect(() => new That([[1, 2], [3, '4']])).to.throw(error)
      expect(() => new That([[1, 2], [3, 4.4]])).to.throw(error)
      expect(() => new That([[[1, 2], 3], [4, 5]])).to.throw(error)
    })
  })

  describe('.elements', function () {
    it('불변 리스트임', function () {
      expect(new That([[2, 2], [2, 2]]).elements).to.be.an.instanceof(List)
    })

    it('생성자에 입력한 값이 대입됨', function () {
      const elements = [[1, 2], [3, 4]]
      expect(new That(elements).elements.toJS()).to.deep.equal(elements)
    })
  })
  describe('.size', function () {
    it('정수임', function () {
      const that = new That([[0, 0], [0, 0]])
      expect(Number.isInteger(that.size)).to.be.true()
    })

    it('크기를 제대로 계산함', function () {
      const two = new That([[1, 2], [3, 4]])
      const three = new That([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

      expect(two.size).to.equal(2)
      expect(three.size).to.equal(3)
    })
  })

  describe('.name', function () {
    it('문자열임', function () {
      const that = new That([[4, 3], [2, 1]])
      expect(that.name).to.be.a('string')
    })

    it('이름을 제대로 표시함', function () {
      const two = new That([[0, 0], [1, 1]])
      const three = new That([[3, 6, 9], [6, 9, 3], [9, 3, 6]])

      expect(two.name).to.equal('2 × 2 정사각행렬')
      expect(three.name).to.equal('3 × 3 정사각행렬')
    })
  })

  describe('#toString', function () {
    it('제대로 출력함: 1 × 1 정사각행렬', function () {
      const one = new That([[1]])
      expect(one.toString()).to.equal('[ 1 ]')
    })

    it('제대로 출력함: 2 × 2 정사각행렬', function () {
      const two = new That([[1, 2], [3, 4]])
      expect(two.toString()).to.equal('⎡ 1 2 ⎤\n⎣ 3 4 ⎦')
    })

    it('제대로 출력함: 3 × 3 정사각행렬', function () {
      const three = new That([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
      expect(three.toString()).to.equal('⎡ 1 2 3 ⎤\n⎢ 4 5 6 ⎥\n⎣ 7 8 9 ⎦')
    })
  })

  describe('#getMinor', function () {
    it('제대로 구함: 3 × 3 정사각행렬', function () {
      const three = new That([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ])

      expect(three.getMinor(1, 1).elements.toJS()).to.deep.equal([
        [1, 3],
        [7, 9]
      ])

      expect(three.getMinor(0, 2).elements.toJS()).to.deep.equal([
        [4, 5],
        [7, 8]
      ])
    })

    it('제대로 구함: 5 × 5 정사각행렬', function () {
      const five = new That([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25]
      ])

      expect(five.getMinor(2, 3).elements.toJS()).to.deep.equal([
        [1, 2, 3, 5],
        [6, 7, 8, 10],
        [16, 17, 18, 20],
        [21, 22, 23, 25]
      ])
    })

    it('에러 던짐: 행렬 최대 범위 초과', function () {
      const that = new That([[1, 2], [3, 4]])
      expect(() => that.getMinor(2, 0)).to.throw('행렬 최대 범위를 벗어났습니다')
      expect(() => that.getMinor(0, 2)).to.throw('행렬 최대 범위를 벗어났습니다')
    })

    it('에러 던짐: 행렬 최소 범위 초과', function () {
      const that = new That([[1, 2], [3, 4]])
      expect(() => that.getMinor(-1, 0)).to.throw('행렬 최소 범위를 벗어났습니다')
      expect(() => that.getMinor(0, -1)).to.throw('행렬 최소 범위를 벗어났습니다')
    })
  })

  describe('#setColumn', function () {
    it('제대로 설정함: 3 × 3 정사각행렬', function () {
      const three = new That([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ])

      expect(three.setColumn(1, [0, 0, 0]).elements.toJS()).to.deep.equal([
        [1, 0, 3],
        [4, 0, 6],
        [7, 0, 9]
      ])

      expect(three.setColumn(0, [2, 2, 2]).elements.toJS()).to.deep.equal([
        [2, 2, 3],
        [2, 5, 6],
        [2, 8, 9]
      ])
    })

    it('에러 던짐: 행렬 최대 범위 초과', function () {
      const that = new That([[1, 2], [3, 4]])
      expect(() => that.setColumn(2, [0, 0])).to.throw('행렬 최대 범위를 벗어났습니다')
    })

    it('에러 던짐: 행렬 최소 범위 초과', function () {
      const that = new That([[1, 2], [3, 4]])
      expect(() => that.setColumn(-1, [0, 0])).to.throw('행렬 최소 범위를 벗어났습니다')
    })

    it('에러 던짐: 열벡터가 아님', function () {
      const error = '열벡터가 아닙니다'
      const that = new That([[1, 2], [3, 4]])

      expect(() => that.setColumn(1, 0)).to.throw(error)
      expect(() => that.setColumn(1, null)).to.throw(error)
      expect(() => that.setColumn(1, [[2, 3], [4, 5]])).to.throw(error)
      expect(() => that.setColumn(1, { '0': 3, '1': 2 })).to.throw(error)
    })

    it('에러 던짐: 열벡터 크기 불일치', function () {
      const that = new That([[1, 2], [3, 4]])
      expect(() => that.setColumn(1, [0, 0, 0])).to.throw('열벡터의 크기가 행렬과 일치하지 않습니다')
    })
  })
})

describe('Determinant', function () {
  describe('#compute', function () {
    it('제대로 동작함: 2 × 2 정사각행렬', function () {
      const two = new SquareMatrix([
        [2, 4],
        [3, 7]
      ])
      expect(Determinant.compute(two)).to.equal(2)
    })

    it('제대로 동작함: 3 × 3 정사각행렬', function () {
      const three = new SquareMatrix([
        [2, 3, 1],
        [3, 0, -1],
        [1, -2, 2]
      ])
      expect(Determinant.compute(three)).to.equal(-31)
    })

    it('제대로 동작함: 4 × 4 정사각행렬', function () {
      const four = new SquareMatrix([
        [1, 2, 1, 4],
        [0, -1, 2, 1],
        [1, 0, 1, 3],
        [0, 1, 3, 1]
      ])
      expect(Determinant.compute(four)).to.equal(-7)
    })

    it('제대로 동작함: 5 × 5 정사각행렬', function () {
      const five = new SquareMatrix([
        [1, 2, 1, 1, 1],
        [1, 1, 1, 1, 3],
        [1, 1, 1, 1, 1],
        [4, 1, 1, 1, 1],
        [1, 1, 1, 5, 1]
      ])
      expect(Determinant.compute(five)).to.equal(-24)
    })
  })
})
