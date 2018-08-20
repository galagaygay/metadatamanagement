package eu.dzhw.fdz.metadatamanagement.relatedpublicationmanagement.repository;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.annotation.Secured;

import eu.dzhw.fdz.metadatamanagement.common.domain.I18nString;
import eu.dzhw.fdz.metadatamanagement.common.domain.projections.IdAndVersionProjection;
import eu.dzhw.fdz.metadatamanagement.common.repository.BaseRepository;
import eu.dzhw.fdz.metadatamanagement.relatedpublicationmanagement.domain.RelatedPublication;
import eu.dzhw.fdz.metadatamanagement.relatedpublicationmanagement.domain.projections.RelatedPublicationSubDocumentProjection;
import eu.dzhw.fdz.metadatamanagement.usermanagement.security.AuthoritiesConstants;

/**
 * Related Publication Repository.
 * 
 * @author Daniel Katzberg
 *
 */
@RepositoryRestResource(path = "/related-publications")
public interface RelatedPublicationRepository 
    extends BaseRepository<RelatedPublication, String> {
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  void delete(RelatedPublication entity);
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  void deleteById(String id);
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  void deleteAll(Iterable<? extends RelatedPublication> entities);
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  void deleteAll();
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  <S extends RelatedPublication> List<S> saveAll(Iterable<S> entites);
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  <S extends RelatedPublication> S save(S entity);
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  <S extends RelatedPublication> List<S> insert(Iterable<S> entities);
  
  @Override
  @Secured(value = AuthoritiesConstants.PUBLISHER)
  <S extends RelatedPublication> S insert(S entity);
  
  @RestResource(exported = false)
  Slice<RelatedPublication> findBy(Pageable pageable);
  
  @RestResource(exported = false)
  List<RelatedPublication> findByStudyIdsContaining(String studyId);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamIdsByStudyIdsContaining(String studyId);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamIdsByDataSetIdsContaining(String dataSetId);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamIdsBySurveyIdsContaining(String surveyId);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamIdsByVariableIdsContaining(String variableId);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamIdsByInstrumentIdsContaining(String instrumentId);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamIdsByQuestionIdsContaining(String questionId);

  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsByStudyIdsContaining(
      String studyId);

  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsByQuestionIdsContaining(
      String questionId);

  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsByVariableIdsContaining(
      String variableId);

  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsBySurveyIdsContaining(
      String surveyId);

  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsByDataSetIdsContaining(
      String dataSetId);

  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsByInstrumentIdsContaining(
      String instrumentId);
  
  @RestResource(exported = false)
  List<RelatedPublicationSubDocumentProjection> findSubDocumentsByStudySeriesesContaining(
      I18nString studySeries);
  
  @RestResource(exported = false)
  Stream<RelatedPublication> streamByStudySeriesesContaining(
      I18nString studySeries);

  @RestResource(exported = false)
  Stream<IdAndVersionProjection> streamAllIdAndVersionsBy();
  
  @RestResource(exported = true)
  List<RelatedPublication> findAllBy();
}
