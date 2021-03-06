.. java:import:: java.time LocalDateTime

.. java:import:: javax.validation.constraints NotEmpty

.. java:import:: javax.validation.constraints NotNull

.. java:import:: javax.validation.constraints Pattern

.. java:import:: javax.validation.constraints Size

.. java:import:: org.javers.core.metamodel.annotation ValueObject

.. java:import:: eu.dzhw.fdz.metadatamanagement.common.domain.util Patterns

.. java:import:: eu.dzhw.fdz.metadatamanagement.common.domain.validation StringLengths

.. java:import:: lombok AllArgsConstructor

.. java:import:: lombok Builder

.. java:import:: lombok Data

.. java:import:: lombok NoArgsConstructor

Release
=======

.. java:package:: eu.dzhw.fdz.metadatamanagement.projectmanagement.domain
   :noindex:

.. java:type:: @NoArgsConstructor @Data @AllArgsConstructor @Builder @ValueObject public class Release

   The release object contains the version and a timestamp of the current release.

Fields
------
date
^^^^

.. java:field:: @NotNull private LocalDateTime date
   :outertype: Release

   The timestamp (in UTC) indicates when a publisher has released the \ :java:ref:`DataAcquisitionProject`\ . Must not be empty.

version
^^^^^^^

.. java:field:: @NotEmpty @Size @Pattern private String version
   :outertype: Release

   A valid semver version (major.minor.patch). Must not be empty and must not contain more than 32 characters. A version of a \ :java:ref:`DataAcquisitionProject`\  must not be decreased.

